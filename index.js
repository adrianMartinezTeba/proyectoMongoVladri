const express = require("express");
const app = express();
const PORT = 8080;
const { dbConnection } = require("./config/config")
app.use(express.json())
dbConnection()
const { handleTypeError } = require("./middlewares/errors");

app.use("/users", require("./routes/users"));
app.use("/comments", require("./routes/comments"));
app.use('/posts', require('./routes/posts'));

app.use(handleTypeError)



app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));