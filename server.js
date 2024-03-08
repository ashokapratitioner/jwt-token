require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const cors = require("cors");
const corsConfig = require("./corsConfig.js");

const translations = require("./translations.json");

app.use(express.json());
app.use(cors(corsConfig));

const posts = [
  {
    id: "1",
    username: "Ashok",
    title: "Post 1",
  },
  {
    id: "2",
    username: "Moment",
    title: "Post 2",
  },
  {
    id: "3",
    username: "Joy",
    title: "Post 3",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts);
});

app.get("/posts/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const post = posts.filter((post) => post.id === id);
  res.json(post);
});

app.get("/translation/:culture/:key", authenticateToken, (req, res) => {
  const { culture, key } = req.params;

  if (translations[culture]) {
    const translation = translations[culture][key];
    if (translation) {
      res.json({ translation });
    } else {
      res.status(404).json({ error: "Translation not found" });
    }
  } else {
    res.status(404).json({ error: "Culture not found" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
