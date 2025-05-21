const mongoose = require("mongoose");

const resturantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 4.5,
    },
    numReviews: {
      type: Number,
      default: 4.5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resturant", resturantSchema);
