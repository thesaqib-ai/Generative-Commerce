const mongoose = require('mongoose');
const Joi = require('joi');

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  color: String,
  size: String,
  qty: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartSchema = new mongoose.Schema({
  cart_token: {
    type: String,
    unique: true,
    sparse: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartSchema);

function validateCart(cart) {
  const schema = Joi.object({
    user_id: Joi.string().optional(),
    cart_token: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().required(),
        color: Joi.string().required(),
        size: Joi.string().required(),
        qty: Joi.number().min(1).required()
      })
    ).required()
  });

  return schema.validate(cart);
}

module.exports = { Cart, validateCart };