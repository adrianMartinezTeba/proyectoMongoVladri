const express = require("express");
const app = express();
const PORT = 8080;
const { dbConnection } = require("./config/config")
app.use(express.json())
dbConnection()

app.use('/posts', require('./routes/posts'));

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));