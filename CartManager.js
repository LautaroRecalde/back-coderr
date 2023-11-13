const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  addCart(cart) {
    cart.id = this.generateCartId();
    cart.products = [];
    this.carts.push(cart);
    this.saveCarts();
  }

  generateCartId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.carts.map(cart => cart.id));
    return maxId + 1;
  }

  getCartById(id) {
    const cart = this.carts.find(cart => cart.id === id);
    if (cart) {
      return cart;
    } else {
      throw new Error("Cart not found");
    }
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.carts.find(cart => cart.id === cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingProduct = cart.products.find(product => product.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    this.saveCarts();
  }
}

module.exports = CartManager;
