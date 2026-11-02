const Transaction = require('../models/Transaction');

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// Only these fields can be set by a client.
function pickFields(body = {}) {
  const allowed = ['title', 'amount', 'type', 'category', 'date', 'note'];
  return Object.fromEntries(
    allowed.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
  );
}

// Query values must be plain strings. This blocks operator injection
// such as ?type[$ne]=income.
function textParam(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function dateParam(value, name) {
  const text = textParam(value);
  if (!text) return undefined;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    const error = new Error(`${name} must be a valid date`);
    error.statusCode = 400;
    throw error;
  }
  return date;
}

function buildFilter(query) {
  const filter = {};
  const type = textParam(query.type);
  const category = textParam(query.category);
  const from = dateParam(query.from, 'from');
  const to = dateParam(query.to, 'to');

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) {
      to.setUTCHours(23, 59, 59, 999); // Include the whole end day.
      filter.date.$lte = to;
    }
  }
  return filter;
}

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find(buildFilter(req.query)).sort({ date: -1, createdAt: -1 });
  res.json(transactions);
});

const getSummary = asyncHandler(async (req, res) => {
  const totals = await Transaction.aggregate([
    { $match: buildFilter(req.query) },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  const income = totals.find((row) => row._id === 'income')?.total ?? 0;
  const expense = totals.find((row) => row._id === 'expense')?.total ?? 0;
  res.json({ income, expense, balance: income - expense });
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.json(transaction);
});

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create(pickFields(req.body));
  res.status(201).json(transaction);
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    new: true,
    runValidators: true,
  });
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.json(transaction);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.status(204).send();
});

module.exports = {
  getTransactions,
  getSummary,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
