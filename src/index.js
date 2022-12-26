const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const users = require("./data/users.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

server.get("/movies", (req, res) => {
  const response = {
    success: true,
    movies: movies,
  };

  res.json(response);
});

//conseguir id de la película que se va a renderizar 
// pedir soporte, qué pelicula hay que encontar para consolear
server.get('/movie/:id', (req, res) => { 
console.log(req.params)
 const foundMovie = movies.find((movie)=> 
 movie.id === req.params.id); 
 res.render('movie', foundMovie)

res.json(foundMovie);
});

//endpoint de users para login
server.post("/login", (req, res) => {
  const find = users.find((user) => user.email === req.body.email);
  let userResponse = "";
  console.log("hola login");
  console.log(req.body.email);
  //console.log(users);
  console.log(find);
  if (find === undefined) {
    userResponse = {
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    };
  } else {
    userResponse = {
      success: true,
      userId: find.id,
    }
  }

  res.json(userResponse);
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
