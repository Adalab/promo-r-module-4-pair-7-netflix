const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const users = require("./data/users.json");
const Database = require("better-sqlite3");

//Url de la base de datos
const db = Database("./src/db/database.db", { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

////////////ENDPOINTS
// Endpoint para pedir todas las peliculas 
server.get("/movies", (req, res) => {
  const query = db.prepare("SELECT * FROM movies");
  const movies = query.all();

  const response = {
    success: true,
    movies: movies,
  };

  res.json(response);
});


 // Endpoint para obtener el id de la url de cada pelicula
server.get("/movie/:id", (req, res) => {
  console.log(req.params);
 
  const foundMovie = movies.find((movie) => movie.id == req.params.id);
  console.log(foundMovie);
  res.render("movie", foundMovie);
});

// Endpoint de users para login
server.post("/login", (req, res) => {
  const query = db.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  );
  const user = query.get(req.body.email, req.body.password);

  if (user === undefined) {
    userResponse = {
      success: false,
      errorMessage: "El usuario y/o la contraseña no coinciden",
    };
  } else {
    userResponse = {
      success: true,
      userId: user.id,
    };
  }

  res.json(userResponse);
});

// Endpoint de users para registrarse
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

// init express aplication, para que arranque el servidor en ese puerto
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});


////////////SERVIDORES ESTÁTICOS
// Servidor para que se muestren las películas en el back
const staticServer = "./src/public-react";
server.use(express.static(staticServer));

// Servidor para que se muestren las imágenes en el back
const staticServerImg = "./src/public-movies-images"; 
server.use(express.static(staticServerImg));
