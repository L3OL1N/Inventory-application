const express = require("express");
const router = express.Router();

// Require controller modules.
const game_controller = require("../controllers/gameController");

// GET home page.
router.get('/', function (req,res) {
    res.render('index',{ title:'Steam Wishlist'})
});

router.get('/games',game_controller.game_list);

module.exports = router;