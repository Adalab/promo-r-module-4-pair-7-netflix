const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const users = require("./data/users.json");
const Database = require("better-sqlite3");

const db = Database("./src/db/database.db", { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

server.get("/movies", (req, res) => {
  const query = db.prepare("SELECT * FROM movies");
  const movies = query.all();

  const response = {
    success: true,
    movies: movies,
  };

  res.json(response);
});

//conseguir id de la película que se va a renderizar
// pedir soporte, qué pelicula hay que encontar para consolear
server.get("/movie/:id", (req, res) => {
  console.log(req.params);
  //HE QUITADO UNO DE LOS IGUALES PORQUE LO QUE LLEGA POR REQ.PARAMS.ID ES UN "1" string y lo que tenemos en movies.json es un 1 entero (integer), hay que poner 2 iguales (compara solo valor) porque si ponemos 3 compara tipo y valor. O HACER parseInt.
  const foundMovie = movies.find((movie) => movie.id == req.params.id);
  console.log(foundMovie);
  res.render("movie", foundMovie);
});

//endpoint de users para login
server.post("/login", (req, res) => {
  const query = db.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  );
  const user = query.get(req.body.email, req.body.password);

  if (user === undefined) {
    userResponse = {
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    };
  } else {
    userResponse = {
      success: true,
      userId: user.id,
    };
  }

  res.json(userResponse);
});

server.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const query = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  const newUser = query.run(email, password);

  res.json({
    "success": true,
    "userId": newUser.lastInsertRowid
  });
});

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const staticServer = "./src/public-react"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServer));

const staticServerImg = "./src/public-movies-images"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerImg));
