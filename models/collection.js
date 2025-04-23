const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema
const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Collection = mongoose.model('Collection', collectionSchema);

// Joi Validation Schema
function validateCollection(collection) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required()
  });

  return schema.validate(collection);
}

module.exports = { Collection, collectionSchema, validateCollection };
