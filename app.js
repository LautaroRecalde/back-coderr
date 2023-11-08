const express = require('express');
const app = express();
const port = 3000; //


// Importa la clase ProductManager
const ProductManager = require('./ProductManager');

// Crea una instancia de ProductManager
const productManager = new ProductManager('productos.json');

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Ruta para obtener todos los productos con un límite opcional
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();
    
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
