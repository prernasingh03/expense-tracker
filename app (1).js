const API_URL = '/api/transactions';

const form = document.getElementById('transaction-form');
const filters = document.getElementById('filters');
const list = document.getElementById('transactions');
const listMessage = document.getElementById('list-message');
const formError = document.getElementById('form-error');
const formTitle = document.getElementById('form-title');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');

let editingId = null;

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

async function request(url, options) {
  const response = await fetch(url, options);
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

function filterQuery() {
  const values = Object.fromEntries(new FormData(filters));
  const active = Object.entries(values).filter(([, value]) => value);
  return new URLSearchParams(active).toString();
}

async function refresh() {
  try {
    const query = filterQuery();
    const [transactions, summary] = await Promise.all([
      request(`${API_URL}?${query}`),
      request(`${API_URL}/summary?${query}`),
    ]);
    renderSummary(summary);
    renderTransactions(transactions);
  } catch (error) {
    listMessage.textContent = error.message;
  }
}

function renderSummary({ income, expense, balance }) {
  document.getElementById('income').textContent = money.format(income);
  document.getElementById('expense').textContent = money.format(expense);
  document.getElementById('balance').textContent = money.format(balance);
}

function renderTransactions(transactions) {
  list.replaceChildren(...transactions.map(createRow));
  listMessage.textContent = transactions.length ? '' : 'No transactions found.';
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function button(label, className, onClick) {
  const node = element('button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

function createRow(transaction) {
  const isIncome = transaction.type === 'income';
  const date = transaction.date.slice(0, 10);
  const details = [transaction.category, date, transaction.note].filter(Boolean).join(' · ');

  const buttons = element('div', 'buttons');
  buttons.append(
    button('Edit', 'secondary', () => startEditing(transaction)),
    button('Delete', 'danger', () => removeTransaction(transaction._id))
  );

  const row = element('li', 'transaction');
  row.append(
    element('span', 'title', transaction.title),
    element('span', `amount ${isIncome ? 'income' : 'expense'}`,
      `${isIncome ? '+' : '-'}${money.format(transaction.amount)}`),
    element('span', 'meta', details),
    buttons
  );
  return row;
}

function startEditing(transaction) {
  editingId = transaction._id;
  form.elements.title.value = transaction.title;
  form.elements.amount.value = transaction.amount;
  form.elements.type.value = transaction.type;
  form.elements.category.value = transaction.category;
  form.elements.date.value = transaction.date.slice(0, 10);
  form.elements.note.value = transaction.note || '';
  formTitle.textContent = 'Edit transaction';
  saveButton.textContent = 'Save changes';
  cancelButton.hidden = false;
  formError.hidden = true;
  form.elements.title.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  form.elements.date.value = new Date().toLocaleDateString('en-CA');
  formTitle.textContent = 'Add transaction';
  saveButton.textContent = 'Add transaction';
  cancelButton.hidden = true;
  formError.hidden = true;
}

async function removeTransaction(id) {
  try {
    await request(`${API_URL}/${id}`, { method: 'DELETE' });
    if (id === editingId) resetForm();
    await refresh();
  } catch (error) {
    listMessage.textContent = error.message;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  body.amount = Number(body.amount);

  try {
    await request(editingId ? `${API_URL}/${editingId}` : API_URL, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    resetForm();
    await refresh();
  } catch (error) {
    formError.textContent = error.message;
    formError.hidden = false;
  }
});

cancelButton.addEventListener('click', resetForm);
filters.addEventListener('change', refresh);

resetForm();
refresh();
