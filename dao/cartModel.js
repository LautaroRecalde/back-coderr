const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // Define la estructura del carrito, podría tener una referencia a los productos, por ejemplo.
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;