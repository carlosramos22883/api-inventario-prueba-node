const jwt = require('jsonwebtoken');

// 1. Middleware para verificar si el usuario está autenticado (tiene token válido)
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    
    // Guardamos los datos del usuario decodificados (id, email, rol) en el objeto req
    req.user = decoded;
    next(); // Permite que la petición continúe hacia el controlador
  });
};

// 2. Middleware específico para Administradores (puedes conservarlo o usar checkRole)
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso prohibido. Se requieren privilegios de administrador.' });
  }
};

// 3. Middleware dinámico/flexible por roles (¡Este es el ideal!)
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado. Usuario no autenticado en la petición.' });
    }

    // Verificamos si el rol del usuario está incluido en los roles permitidos
    if (allowedRoles.includes(req.user.rol)) {
      next(); // Pasa al siguiente controlador
    } else {
      res.status(403).json({ 
        message: `Acceso prohibido. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}.` 
      });
    }
  };
};