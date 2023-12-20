const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

app.use(express.json());

// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar Socket.io para la actualización en tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Emitir la lista de productos a la conexión recién establecida
  socket.emit('updateProducts', productManager.getProducts());

  // Manejar eventos de creación y eliminación de productos
  socket.on('createProduct', (newProduct) => {
    try {
      productManager.addProduct(newProduct);
      const updatedProducts = productManager.getProducts();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('deleteProduct', (productId) => {
    try {
      productManager.deleteProduct(productId);
      const updatedProducts = productManager.getProducts();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Ruta para la vista en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
