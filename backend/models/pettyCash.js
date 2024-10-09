const mongoose = require('mongoose');

const pettyCashSchema = new mongoose.Schema({
  receipt: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  voucherNumber: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  officeExpense: {
    type: Number,
    default: 0,
  },
  vanExpense: {
    type: Number,
    default: 0,
  },
  cleaningExpense: {
    type: Number,
    default: 0,
  },
  sundryExpense: {
    type: Number,
    default: 0,
  },
  balanceCD: {
    type: Number,
    default: 0,
  },
  balanceBD: {
    type: Number,
    default: 0,
  },
});

const PettyCash = mongoose.model('PettyCash', pettyCashSchema);

module.exports = PettyCash;
