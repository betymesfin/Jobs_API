const { StatusCodes } = require("http-status-codes");
const Resturant = require("../models/Resturant");

const getAllresturant = async (req, res) => {
  const resturant = await Resturant.find();
  res.status(StatusCodes.OK).json(resturant);
};

const getSingleresturant = async (req, res) => {
  const resturant = await Resturant.findOne();
  res.status(StatusCodes.OK).json(resturant);
};

module.exports = { getAllresturant, getSingleresturant };
