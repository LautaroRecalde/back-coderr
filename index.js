const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || product.stock === undefined) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (this.products.some(p => p.code === product.code)) {
      throw new Error("Ya existe un producto con el mismo código.");
    }

    product.id = this.generateProductId();
    this.products.push(product);
    this.saveProducts();
  }

  generateProductId() {
    if (this.products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.products.map(product => product.id));
    return maxId + 1;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
      return product;
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    this.products[index] = { ...this.products[index], ...updatedProduct };
    this.saveProducts();
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    this.products.splice(index, 1);
    this.saveProducts();
  }
}

// Ejemplo de uso
const productManager = new ProductManager('productos.json');

try {
  productManager.addProduct({
    title: "Producto 1",
    description: "Descripción del Producto 1",
    price: 19.99,
    thumbnail: "imagen1.jpg",
    code: "P1",
    stock: 10
  });

  productManager.addProduct({
    title: "Producto 2",
    description: "Descripción del Producto 2",
    price: 29.99,
    thumbnail: "imagen2.jpg",
    code: "P2",
    stock: 5
  });

  const allProducts = productManager.getProducts();
  console.log(allProducts);

  const product = productManager.getProductById(1);
  console.log(product);

  productManager.updateProduct(1, { price: 29.99, stock: 15 });
  productManager.deleteProduct(2);

  const updatedProduct = productManager.getProductById(1);
  console.log(updatedProduct);
} catch (error) {
  console.error(error.message);
}
