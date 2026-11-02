const express = require('express');
const {
  getTransactions,
  getSummary,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

// /summary must come before /:id, or Express would treat "summary" as an id.
router.get('/summary', getSummary);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
