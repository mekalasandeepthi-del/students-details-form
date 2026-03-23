const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "student-db.cn8cysqqip2g.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Student12348#",
  database: "studentdb",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to RDS database");
  }
});

/* GET students */
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

/* ADD student */
app.post("/students", (req, res) => {

  console.log(req.body);   // add this line

  const { name, age, course } = req.body;

  db.query(
    "INSERT INTO students (name, age, course) VALUES (?, ?, ?)",
    [name, age, course],
    (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    }
  );
});

/* UPDATE student */
app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const { name, age, course } = req.body;

  db.query(
    "UPDATE students SET name=?, age=?, course=? WHERE id=?",
    [name, age, course, id],
    (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    }
  );
});

/* DELETE student */
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM students WHERE id=?", [id], (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});