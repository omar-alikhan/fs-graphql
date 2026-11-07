const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

schema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
});

schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Author", schema);
