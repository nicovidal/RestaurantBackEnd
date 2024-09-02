const express = require("express");
require("dotenv").config();
const {dbConnection}=require('./database/config')

const app = express();

/* coneccionDB */
dbConnection()

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});


//parse bod
app.use(express.json());

app.use(express.static("public"));