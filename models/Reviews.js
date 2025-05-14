const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    resturant: {
      type: mongoose.Types.ObjectId,
      ref: "Resturant",
      required: [false, "Please provide resturant"],
    },
    comment: {
      type: String,
      required: false,
    },

    rating: {
      type: Number,
      default: 4.5,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
