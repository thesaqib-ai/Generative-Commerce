const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  category: {
    type: String,
    enum: ['Sneakers', 'Loafers', 'Formal', 'Sandals', 'Boots', 'Slippers', 'Sports'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    required: true
  },
  variants: [
    {
      colorName: {
        type: String,
        required: true
      },
      hexCode: String,
      images: [String], // array of image URLs specific to this color
      sizes: [
        {
          size: Number,
          stock: {
            type: Number,
            default: 0,
            min: 0
          }
        }
      ]
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(100).required(),
      brand: Joi.string().required(),
      collection: Joi.string().required(),
      category: Joi.string().valid('Sneakers', 'Loafers', 'Formal', 'Sandals', 'Boots', 'Slippers', 'Sports').required(),
      gender: Joi.string().valid('Men', 'Women', 'Unisex').required(),
      variants: Joi.array().items(
        Joi.object({
          colorName: Joi.string().required(),
          hexCode: Joi.string().optional(),
          images: Joi.array().items(Joi.string().uri()).optional(),
          sizes: Joi.array().items(
            Joi.object({
              size: Joi.number().required(),
              stock: Joi.number().min(0).required()
            })
          ).required()
        })
      ).required(),
      price: Joi.number().min(0).required(),
      discount: Joi.number().min(0).max(100),
      description: Joi.string().max(1000).allow('', null),
      isFeatured: Joi.boolean()
    });
  
    return schema.validate(product);
  }  

  module.exports = {Product, validateProduct};