const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.pjbgc.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

async function connect() {
  try {
    await mongoose.connect(url,{ 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Succesfully connect to troviet database");
  } catch (error) {
    console.log(`Fail to connect to MongoDB - database : ${process.env.DATABASE_USERNAME}`);
  }
}


module.exports = { connect };
