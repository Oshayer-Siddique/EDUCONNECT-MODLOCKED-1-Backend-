require('dotenv').config();

var mongoose = require('mongoose');

mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = require('express')();
// const app = express();

const http = require('http').Server(app);

const userRoute = require('./routes/userRoute');

app.use('/',userRoute);

http.listen(3000, function(){
    console.log('Server is running')
})