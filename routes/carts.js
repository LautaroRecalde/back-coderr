// routes/carts.js
const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');

const cartManager = new CartManager('carrito.json');

router.post('/', (req, res) => {
  try {
    const newCart = req.body;
    cartManager.addCart(newCart);
    res.json({ message: 'Cart created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Cart not found' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const quantity = req.body.quantity || 1;
    cartManager.addProductToCart(cartId, productId, quantity);
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
