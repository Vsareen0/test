const express = require("express");
const app = express();
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");

const dotenv = require("dotenv");
dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, () => {
  console.log("Connected to DB ");
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server is running at port : ${PORT}`));
});

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
