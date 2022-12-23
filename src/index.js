const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.get("/movies", (req, res) => {
  const response = {
    success: true,
    movies: movies,
  };

  res.json(response);
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