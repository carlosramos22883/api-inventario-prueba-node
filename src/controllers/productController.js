const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// 1. Obtener todos los productos (Para Admin y Usuario)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'codigo', 'nombre', 'id_categoria', 'precio_venta', 'stock_actual', 'disponible', 'createdAt', 'updatedAt'],
      include: [{
        model: Category,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }],
      order: [['nombre', 'ASC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Obtener producto por ID (Para Admin y Usuario)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: ['id', 'codigo', 'nombre', 'id_categoria', 'precio_venta', 'stock_actual', 'disponible', 'createdAt', 'updatedAt'],
      include: [{
        model: Category,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Crear un nuevo producto (Solo Admin)
exports.createProduct = async (req, res) => {
  try {
    const { codigo, nombre, id_categoria, precio_venta, stock_actual } = req.body;

    // Validaciones básicas de campos obligatorios y longitudes
    if (!codigo || codigo.trim().length > 10) {
      return res.status(400).json({ message: 'El código es obligatorio y no puede exceder los 10 caracteres.' });
    }
    if (!nombre || nombre.trim().length > 50) {
      return res.status(400).json({ message: 'El nombre es obligatorio y no puede exceder los 50 caracteres.' });
    }
    if (!id_categoria) {
      return res.status(400).json({ message: 'La categoría es obligatoria.' });
    }

    // Validar rangos de precio de venta (0.00 a 1000.00)
    const precio = parseFloat(precio_venta);
    if (isNaN(precio) || precio < 0.00 || precio > 1000.00) {
      return res.status(400).json({ message: 'El precio de venta debe estar entre 0.00 y 1000.00.' });
    }

    // Validar rangos de stock actual (0 a 1000)
    const stock = parseInt(stock_actual, 10);
    if (isNaN(stock) || stock < 0 || stock > 1000) {
      return res.status(400).json({ message: 'El stock actual debe ser un valor entero entre 0 y 1000.' });
    }

    // Verificar que la categoría exista
    const categoryExists = await Category.findByPk(id_categoria);
    if (!categoryExists) {
      return res.status(400).json({ message: 'La categoría especificada no existe.' });
    }

    // Crear el producto (el hook de Sequelize calculará el campo 'disponible' automáticamente)
    const newProduct = await Product.create({
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      id_categoria,
      precio_venta: precio.toFixed(2),
      stock_actual: stock
    });

    res.status(201).json({
      message: 'Producto creado exitosamente.',
      product: newProduct
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El código o el nombre del producto ya se encuentran registrados.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// 4. Actualizar un producto (Solo Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, id_categoria, precio_venta, stock_actual } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Validaciones opcionales si se envían en el body
    let precio = product.precio_venta;
    if (precio_venta !== undefined) {
      precio = parseFloat(precio_venta);
      if (isNaN(precio) || precio < 0.00 || precio > 1000.00) {
        return res.status(400).json({ message: 'El precio de venta debe estar entre 0.00 y 1000.00.' });
      }
    }

    let stock = product.stock_actual;
    if (stock_actual !== undefined) {
      stock = parseInt(stock_actual, 10);
      if (isNaN(stock) || stock < 0 || stock > 1000) {
        return res.status(400).json({ message: 'El stock actual debe ser un valor entero entre 0 y 1000.' });
      }
    }

    if (id_categoria && id_categoria !== product.id_categoria) {
      const categoryExists = await Category.findByPk(id_categoria);
      if (!categoryExists) {
        return res.status(400).json({ message: 'La categoría especificada no existe.' });
      }
    }

    await product.update({
      codigo: codigo ? codigo.trim() : product.codigo,
      nombre: nombre ? nombre.trim() : product.nombre,
      id_categoria: id_categoria || product.id_categoria,
      precio_venta: precio,
      stock_actual: stock
    });

    res.json({
      message: 'Producto actualizado exitosamente.',
      product
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El código o el nombre ya están en uso por otro producto.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// 5. Eliminar un producto (Solo Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};