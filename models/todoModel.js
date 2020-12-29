const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    id: { type: String, required: true },
    completed: { type: Boolean, required: true },
    userId: { type: String, required: true }
});

module.exports = Todo = mongoose.model("todo", todoSchema);