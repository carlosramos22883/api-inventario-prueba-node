const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');

// Importar configuración de Swagger
const swaggerDocs = require('./config/swaggerConfig');

// Importar los seeders
const seedUser = require('./seeders/userSeeder');
const seedCategorys = require('./seeders/categorysSeeder');

const app = express();
app.use(cors());
app.use(express.json());

// Registrar rutas de la API
app.use('/api/usuarios', userRoutes);
app.use('/api/reportes', reportRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/compras', purchaseRoutes);
app.use('/api/ventas', saleRoutes);

// Inicializar Swagger UI en la ruta /api-docs
swaggerDocs(app);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('Base de datos sincronizada.');

  try {
    // Ejecutar seeders
    await seedUser();
    await seedCategorys();
    console.log('Seeders ejecutados correctamente.');
  } catch (error) {
    console.error('Error al ejecutar los seeders:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error de conexión:', err);
});