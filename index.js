const express = require("express");
require("dotenv").config();
const {dbConnection}=require('./database/config')

const app = express();

/* coneccionDB */
dbConnection()



//parse bod
app.use(express.json());

app.use(express.static("public"));


//routes
app.use("/api/restaurant", require("./routes/Restaurant"))



app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});






