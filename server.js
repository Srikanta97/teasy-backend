const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.REACT_APP_MONGODB_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
        if (err) throw err;
        console.log('MONGODB connection established');
    }
);

app.use('/users', require('./routes/userRouter'));
app.use('/todos', require('./routes/todoRouter'));
app.use('/expense', require('./routes/expenseRouter'));