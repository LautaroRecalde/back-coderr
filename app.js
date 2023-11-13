const express = require('express');
const app = express();
const port = 8080;

const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const productsRouter = express.Router();
const cartsRouter = express.Router();

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

app.use(express.json());

// Rutas para productos
productsRouter.get('/', async (req, res) => {
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

productsRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Product not found' });
  }
});

productsRouter.post('/', (req, res) => {
  try {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

productsRouter.put('/:pid', (req, res) => {
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

productsRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    productManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: error.message });
  }
});

// Rutas para carritos
cartsRouter.post('/', (req, res) => {
  try {
    const newCart = req.body;
    cartManager.addCart(newCart);
    res.json({ message: 'Cart created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Cart not found' });
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
