const express = require('express');
const {config} = require('dotenv')
const moongose = require('mongoose');
const bodyParse = require('body-parser');
config();

const nbaPlayersRoutes = require('./routes/nbaPlayers.routes');

//express midleware
const app = express();
app.use(bodyParse.json());

//conexion de base de datos
moongose.connect(process.env.MONGO_URL, {dbName:process.env.MONGO_DB_NAME});

const db = moongose.connection;

app.use('/nbaPlayers', nbaPlayersRoutes)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("servidor escuchando en el puerto", port)
})