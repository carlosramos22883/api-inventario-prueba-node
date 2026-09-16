const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,25}$/;

// GET todos los usuarios (Usando Sequelize)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'nombre', 'email', 'rol', 'created_at', 'updated_at'] });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST crear usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || nombre.trim().length < 2 || nombre.length > 50) {
      return res.status(400).json({ message: 'El nombre debe tener entre 2 y 50 caracteres.' });
    }
    if (!email || email.length > 50 || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Correo electrónico inválido.' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'La contraseña no cumple con los requisitos de seguridad.' });
    }
    const userRol = rol && ['admin', 'usuario'].includes(rol) ? rol : 'usuario';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear registro usando Sequelize
    const newUser = await User.create({
      nombre: nombre.trim(),
      email,
      password: hashedPassword,
      rol: userRol
    });

    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      rol: newUser.rol,
      created_at: newUser.created_at
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { nombre, email, rol, password } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Validaciones opcionales si se envían
    if (nombre && (nombre.trim().length < 2 || nombre.length > 50)) {
      return res.status(400).json({ message: 'Nombre inválido.' });
    }
    if (email && (!emailRegex.test(email) || email.length > 50)) {
      return res.status(400).json({ message: 'Correo inválido.' });
    }

    let hashedPassword = user.password;
    if (password) {
      if (!passwordRegex.test(password)) return res.status(400).json({ message: 'Contraseña débil.' });
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar con Sequelize
    await user.update({
      nombre: nombre ? nombre.trim() : user.nombre,
      email: email || user.email,
      password: hashedPassword,
      rol: rol && ['admin', 'usuario'].includes(rol) ? rol : user.rol
    });

    res.json({ message: 'Usuario actualizado exitosamente', updated_at: user.updated_at });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El correo ya está en uso por otro usuario.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};