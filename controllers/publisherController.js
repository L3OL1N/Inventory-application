const Publisher = require("../models/publisher");
const Game = require("../models/game");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Publishers.
exports.publisher_list = function (req, res, next) {
  Publisher.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_publishers) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("publisher_list", {
        title: "Publisher List",
        publisher_list: list_publishers,
      });
    });
};


// Display detail page for a specific publisher.
exports.publisher_detail = (req, res, next) => {
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.params.id)
        .exec(callback);
      },
      publisher_games(callback) {
        Game.find({"publisher":req.params.id},"name")
        .exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.publisher == null) {
        // No results.
        console.log(publisher)
        const err = new Error("Publisher not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("publisher_detail", {
        title: "Publisher Detail",
        publisher:results.publisher,
        games: results.publisher_games,
      });
    }
  );
};


// Display publisher create form on GET.
exports.publisher_create_get = (req, res, next) => {
  // Get all , which we can use for adding to our publisher.
  async.parallel(
    {
      
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("publisher_form", {
        title: "Create Publisher",
      });
    }
  );
};


// Handle publisher create on POST.
exports.publisher_create_post = [

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("founded", "Founded must not be empty")
    .trim()
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("website", "Website must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("website", "Website must be an URL.")
    .isURL({ protocols: ['http','https','ftp']}),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Game object with escaped and trimmed data.
    const publisher = new Publisher({
      name: req.body.name,
      founded: req.body.data,
      website:req.body.website
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all publishers and genres for form.
      async.parallel(
        {
          
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("publisher_form", {
            title: "Create Publisher",
            publisher,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    publisher.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(publisher.url);
    });
  },
];

// Display publisher delete form on GET.
exports.publisher_delete_get = (req, res, next) => {
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.params.id).exec(callback);
      },
      publisher_games(callback) {
        Game.find({"publisher":req.params.id},"name")
        .exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.publisher == null) {
        // No results.
        res.redirect("/publishers");
      }
      // Successful, so render.
      res.render("publisher_delete", {
        title: "Delete Publisher",
        publisher: results.publisher,
        publisher_games: results.publisher_games
      });
    }
  );
};

// Handle publisher delete on POST.
exports.publisher_delete_post = (req, res, next) => {
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.params.id).exec(callback);
      },
      publisher_games(callback) {
        Game.find({"publisher":req.params.id},"name")
        .exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.publisher_games.length > 0) {
        // Publisher has games. Render in same way as for GET route.
        res.render("publisher_delete", {
          title: "Delete Publisher",
          publisher: results.publisher,
          publisher_games: results.publisher_games,
        });
        return;
      }
      // Publisher has no games. Delete object and redirect to the list of publishers.
      Publisher.findByIdAndRemove(req.body.publisherid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to publisher list
        res.redirect("/publishers");
      });
    }
  );
};


// Display publisher update form on GET.
exports.publisher_update_get = (req, res, next) => {
  // Get publisher for form.
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.params.id)
        .exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.publisher == null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("publisher_form", {
        title: "Update Publisher",
        publisher: results.publisher,
      });
    }
  );
};

// Handle publisher update on POST.
exports.publisher_update_post = [

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("founded", "Founded must not be empty")
    .trim()
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("website", "Website must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("website", "Website must be an URL.")
    .isURL({ protocols: ['http','https','ftp']}),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a game object with escaped and trimmed data.
    const publisher = new Publisher({ 
      name: req.body.name,
      founded: req.body.data,
      website:req.body.website,
      _id: req.params.id, //This is required, or a new ID will be assigned! 
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get Game for form.
      async.parallel(
        {
          publisher(callback) {
            Publisher.findById(req.params.id)
            .exec(callback)
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("publisher_form", {
            title: "Update Publisher",
            publisher: results.publisher,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Publisher.findByIdAndUpdate(req.params.id, publisher, {}, (err, thepublisher) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to genre detail page.
      res.redirect(thepublisher.url);
    });
  },
];
