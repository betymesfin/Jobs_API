const express = require("express");
const router = express.Router();
const { getAllresturant,getSingleresturant  } = require("../controllers/resturants");


router.route('/').get(getAllresturant)
router.route("/:id").get(getSingleresturant);

module.exports = router