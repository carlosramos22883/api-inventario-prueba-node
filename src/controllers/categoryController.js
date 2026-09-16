const Category = require('../models/categoryModel');

// 1. Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'nombre', 'createdAt', 'updatedAt'],
      order: [['nombre', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      attributes: ['id', 'nombre', 'createdAt', 'updatedAt']
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Crear una nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim().length < 2 || nombre.trim().length > 40) {
      return res.status(400).json({ message: 'El nombre de la categoría debe tener entre 2 y 40 caracteres.' });
    }

    const newCategory = await Category.create({
      nombre: nombre.trim()
    });

    res.status(201).json({
      message: 'Categoría creada exitosamente.',
      category: newCategory
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// 4. Actualizar una categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    if (nombre && (nombre.trim().length < 2 || nombre.trim().length > 40)) {
      return res.status(400).json({ message: 'El nombre de la categoría debe tener entre 2 y 40 caracteres.' });
    }

    await category.update({
      nombre: nombre ? nombre.trim() : category.nombre
    });

    res.json({
      message: 'Categoría actualizada exitosamente.',
      category
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe otra categoría con ese nombre.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// 5. Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    await category.destroy();
    res.json({ message: 'Categoría eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};