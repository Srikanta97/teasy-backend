const router = require("express").Router();
const auth = require("../middleware/auth");
const Todo = require("../models/todoModel");

router.post("/", auth, async (req, res) => {
    try {
        const { title, id, completed } = req.body;

        if (!title) {
            return res.status(400).json({
                msg: "Give it a name!"
            });
        }
        if (!id) {
            return res.status(400).json({
                msg: "ID not generated"
            });
        }
        const newTodo = new Todo({
            title,
            id,
            completed,
            userId: req.user
        });
        const saveTodo = await newTodo.save();
        res.json({
            title: saveTodo.title,
            id: saveTodo.id,
        });
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/all", auth, async (req, res) => {
    const todos = await Todo.find({ userId: req.user });
    let sendBack = [];
    todos.forEach(todo => {
        sendBack.push({
            title: todo.title,
            id: todo.id,
            completed: todo.completed
        });
    });
    res.json(sendBack);
})

router.delete("/:id", auth, async (req, res) => {
    const todo = await Todo.findOne({ userId: req.user, id: req.params.id });
    if (!todo) {
        return res.status(400).json({
            msg: "No todo found!"
        });
    }
    const deletedTodo = await Todo.deleteOne({id:req.params.id});
    res.json(deletedTodo);
});

router.put("/:id", auth, async (req, res) => {
    const todo = await Todo.findOne({ userId: req.user, id: req.params.id });
    if (!todo) {
        return res.status(400).json({
            msg: "No todo found!"
        });
    }
    const updatedTodo = await Todo.updateOne({ id: req.params.id }, { completed: true });
    res.json(updatedTodo);
});

module.exports = router;