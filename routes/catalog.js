const express = require("express");
const router = express.Router();

// Require controller modules.
const game_controller = require("../controllers/gameController");
const publisher_controller = require("../controllers/publisherController");

// GET home page.
router.get('/', function (req,res) {
    res.render('index',{ title:'Steam Wishlist'})
});

//Game 
router.get('/games',game_controller.game_list);

//Publisher
router.get('/publishers',publisher_controller.publisher_list);

module.exports = router;