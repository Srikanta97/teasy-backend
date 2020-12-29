const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    savings: { type: String, required: true},
    userId: { type: String, required: true }
});

module.exports = Expense = mongoose.model("expense", expenseSchema);