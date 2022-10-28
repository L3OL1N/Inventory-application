const Publisher = require("../models/publisher");
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
  res.send("Not publisher_detail page")
};


// Display publisher create form on GET.
exports.publisher_create_get = (req, res, next) => {
  res.send("Not publisher_create_get page")
};


// Handle publisher create on POST.
exports.publisher_create_post = (req, res, next) => {
  res.send("Not publisher_create_post page")
};


// Display publisher delete form on GET.
exports.publisher_delete_get = (req, res, next) => {
  res.send("Not publisher_delete_get page")
};


// Handle publisher delete on POST.
exports.publisher_delete_post = (req, res, next) => {
  res.send("Not publisher_delete_post page")
};


// Display publisher update form on GET.
exports.publisher_update_get = (req, res, next) => {
  res.send("Not publisher_update_get page")
};

// Handle publisher update on POST.
exports.publisher_update_post = (req, res, next) => {
  res.send("Not publisher_update_post page")
};