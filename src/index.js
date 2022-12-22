const express = require('express');
const cors = require('cors');
const movies = require('../web/src/data/movies.json');


// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.get("/movies" , (req, res) =>{
const response = 
{
  success: true,
  movies: movies
}

res.json(response);
});




// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
console.log(`Server listening at http://localhost:${serverPort}`);
}); 