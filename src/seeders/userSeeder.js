const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const seedUser = async () => {
  try {
    const userCount = await User.count();
    
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('Carlos123!', 10);
      
      await User.create({
        nombre: 'Carlos Adolfo Ramos Ramírez',
        email: 'carlos@test.com',
        password: hashedPassword,
        rol: 'admin'
      });
      
      console.log('Seeder de usuario admin ejecutado exitosamente.');
    } else {
      console.log('El usuario admin ya existe, se omite el seeder.');
    }
  } catch (error) {
    console.error('Error al ejecutar el seeder de usuario:', error.message);
  }
};

module.exports = seedUser;