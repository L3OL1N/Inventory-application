const express = require("express");
const router = express.Router();

// Require controller modules.
const game_controller = require("../controllers/gameController");
const publisher_controller = require("../controllers/publisherController");
const genre_controller = require("../controllers/genreController");

// GET home page.
router.get('/', function (req,res) {
    res.render('index',{ title:'Steam Wishlist'})
});

////Game                  ----------------------------------------------------
router.get('/games',game_controller.game_list);
//Game create
router.get('/game/create',game_controller.game_create_get);
router.post('/game/create',game_controller.game_create_post);
//Game update
router.get('/game/:id/update',game_controller.game_update_get);
router.post('/game/:id/update',game_controller.game_update_post);

router.get('/game/:id',game_controller.game_detail);

////Publisher             ----------------------------------------------------
router.get('/publishers',publisher_controller.publisher_list);
//Publisher create
router.get('/publisher/create',publisher_controller.publisher_create_get);
router.post('/publisher/create',publisher_controller.publisher_create_post);
//Publisher update
router.get('/publisher/:id/update',publisher_controller.publisher_update_get);
router.post('/publisher/:id/update',publisher_controller.publisher_update_post);

router.get('/publisher/:id',publisher_controller.publisher_detail);

////Genre               ----------------------------------------------------
router.get('/genres',genre_controller.genre_list);
//Genre create
router.get('/genre/create',genre_controller.genre_create_get);
router.post('/genre/create',genre_controller.genre_create_post);
//Genre update
router.get('/genre/:id/update',genre_controller.genre_update_get);
router.post('/genre/:id/update',genre_controller.genre_update_post);

router.get('/genre/:id',genre_controller.genre_detail);

module.exports = router;