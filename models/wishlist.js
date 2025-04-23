const mongoose = require('mongoose');
const Joi = require('joi');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

function validateWishlist(data) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required()
  });
  return schema.validate(data);
}

module.exports = { Wishlist, validateWishlist };