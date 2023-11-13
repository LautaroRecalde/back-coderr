// routes/products.js
const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');

const productManager = new ProductManager('productos.json');

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Product not found' });
  }
});

router.post('/', (req, res) => {
  try {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const updatedProduct = req.body;
    productManager.updateProduct(productId, updatedProduct);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    productManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
