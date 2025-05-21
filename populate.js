require("dotenv").config();

const connectDB = require("./db/connect");
const Resturant = require("./models/Resturant");

const jsonResturant = require("./resturant.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Resturant.deleteMany();
    await Resturant.create(jsonResturant);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
