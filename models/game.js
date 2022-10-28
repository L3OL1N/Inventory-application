const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name:{type:String, required: true, minLength: 1, maxLength: 100},
    summary:{type:String,required:true},
    date_of_publish:{type:Date},
    publisher:{type:Schema.Types.ObjectId,ref: "Publisher",required:true},
    genre:[{type:Schema.Types.ObjectId,ref: "Genre"}],
    steam_page:{type:String}
})

// Virtual for game's URL
GameSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/game/${this._id}`;
  });
// Virtual for game's date
GameSchema.virtual("date_format").get(function () {
  // We don't use an arrow function as we'll need the this object
  return this.date_of_publish?
  DateTime.fromJSDate(this.date_of_publish).toISODate():"";
});

// Export model
module.exports = mongoose.model("Game", GameSchema);