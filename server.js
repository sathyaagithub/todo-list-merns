require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello jeevan");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log("database not connected: " + error);
  });

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
});

const todoModel = mongoose.model("Link", todoSchema);

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodos = new todoModel({ title, description });
    await newTodos.save();
    res.status(201).json(newTodos);
    console.log(newTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const getTodos = await todoModel.find();
    res.status(200).json(getTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updateTodos = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updateTodos) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updateTodos);
    console.log(updateTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await todoModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("server is running on port " + port);
});
