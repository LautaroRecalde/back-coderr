const express = require('express');
const router = express.Router();
const Product = require('../dao/models/productModel');

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query) {
      // Agrega lógica para filtrar por categoría o disponibilidad, por ejemplo:
      // filter.category = query;
      // filter.availability = true;
    }

    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortOptions = {};
    if (sort) {
      sortOptions.price = sortOrder; // Ordena por precio ascendente o descendente
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const nextPage = hasNextPage ? `/api/products?page=${parseInt(page) + 1}&limit=${limit}&sort=${sort}&query=${query}` : null;
    const prevPage = hasPrevPage ? `/api/products?page=${parseInt(page) - 1}&limit=${limit}&sort=${sort}&query=${query}` : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: parseInt(page),
      hasNextPage,
      hasPrevPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Otros endpoints para crear, actualizar y eliminar productos van aquí...

module.exports = router