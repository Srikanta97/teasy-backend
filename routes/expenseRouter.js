const router = require("express").Router();
const auth = require("../middleware/auth");
const Expense = require("../models/expenseModel");

router.post("/", auth, async (req, res) => {
    try {
        const { title, id, amount, savings } = req.body;

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
        if (!amount) {
            return res.status(400).json({
                msg: "Specify amount!"
            });
        }
        const newData = new Expense({
            title,
            id,
            amount,
            savings,
            userId: req.user
        });
        const saveData = await newData.save();
        res.json({
            title: saveData.title,
            id: saveData.id,
        });
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/all", auth, async (req, res) => {
    const expenses = await Expense.find({ userId: req.user });
    let sendBack = [];
    expenses.forEach(expense => {
        sendBack.push({
            title: expense.title,
            id: expense.id,
            amount: expense.amount,
            savings: expense.savings
        });
    });
    res.json(sendBack);
})

router.delete("/:id", auth, async (req, res) => {
    const expense = await Expense.findOne({ userId: req.user, id: req.params.id });
    if (!expense) {
        return res.status(400).json({
            msg: "No data found!"
        });
    }
    const deletedEntry = await Expense.deleteOne({id:req.params.id});
    res.json(deletedEntry);
});

module.exports = router;