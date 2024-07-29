// This is the root file
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 3000;

//Connect application to database then open the server.
connectToDatabase()
  .then(()=>{
    app.listen(PORT, ()=> 
    console.log("Connected to Database & Server Open"));
  })
  .catch((err) => console.log(err));


