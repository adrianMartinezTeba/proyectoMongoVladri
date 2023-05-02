const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const { dbConnection } = require("./config/config")
app.use(express.json())
dbConnection()
app.use(cors());
const { handleTypeError } = require("./middlewares/errors");

app.use("/users", require("./routes/users"));
app.use("/comments", require("./routes/comments"));
app.use('/posts', require('./routes/posts'));

app.use(handleTypeError)



app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));