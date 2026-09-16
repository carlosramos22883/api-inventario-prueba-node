const Category = require('../models/categoryModel');

const seedCategorys = async () => {
  const categorys = [
    { nombre: 'Tecnología y Gadgets' },
    { nombre: 'Laptops y Computadoras' },
    { nombre: 'Smartphones y Telefonía' },
    { nombre: 'Audio y Sonido' },
    { nombre: 'Electrodomésticos' },
    { nombre: 'Línea Blanca' },
    { nombre: 'Herramientas y Ferretería' },
    { nombre: 'Ropa y Calzado' },
    { nombre: 'Deportes y Fitness' },
    { nombre: 'Salud y Cuidado Personal' },
    { nombre: 'Alimentos y Bebidas' },
    { nombre: 'Supermercado' },
    { nombre: 'Hogar y Decoración' },
    { nombre: 'Muebles y Oficina' },
    { nombre: 'Juguetes y Entretenimiento' },
    { nombre: 'Libros y Papelería' },
    { nombre: 'Automotriz y Motor' },
    { nombre: 'Mascotas y Accesorios' },
    { nombre: 'Jardinería y Exteriores' },
    { nombre: 'Bebés y Maternidad' }
  ];

  try {
    await Category.bulkCreate(categorys, { ignoreDuplicates: true });
    console.log('Seeder de categorías ejecutado exitosamente.');
  } catch (error) {
    console.error('Error al ejecutar el seeder de categorías:', error);
  }
};

module.exports = seedCategorys;