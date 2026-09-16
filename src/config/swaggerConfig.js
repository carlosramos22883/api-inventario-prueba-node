const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Inventario - Prueba Técnica',
      version: '1.0.0',
      description: 'Documentación oficial y completa de la API backend desarrollada con Node.js, Express y Sequelize.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce tu token JWT obtenido en el endpoint de Login (ej: Bearer tu_token_aqui)'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      // ==========================================
      // USUARIOS Y AUTENTICACIÓN
      // ==========================================
      '/api/usuarios': {
        post: {
          summary: 'Registrar un nuevo usuario',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Carlos Ramos' },
                    email: { type: 'string', example: 'carlos@test.com' },
                    password: { type: 'string', example: 'Carlos123!' },
                    rol: { type: 'string', example: 'admin', enum: ['admin', 'usuario'] }
                  },
                  required: ['nombre', 'email', 'password']
                }
              }
            }
          },
          responses: {
            '201': { description: 'Usuario registrado exitosamente' },
            '400': { description: 'Datos inválidos o correo ya registrado' }
          }
        },
        get: {
          summary: 'Obtener todos los usuarios (Solo Admin)',
          tags: ['Usuarios'],
          responses: {
            '200': { description: 'Lista de usuarios' },
            '403': { description: 'Acceso prohibido' }
          }
        }
      },
      '/api/usuarios/login': {
        post: {
          summary: 'Iniciar sesión',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'carlos@test.com' },
                    password: { type: 'string', example: 'Carlos123!' }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Login exitoso, retorna el token JWT' },
            '401': { description: 'Credenciales inválidas' }
          }
        }
      },
      '/api/usuarios/{id}': {
        get: {
          summary: 'Obtener usuario por ID',
          tags: ['Usuarios'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            '200': { description: 'Datos del usuario' },
            '404': { description: 'Usuario no encontrado' }
          }
        },
        put: {
          summary: 'Actualizar usuario',
          tags: ['Usuarios'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Carlos Actualizado' },
                    email: { type: 'string', example: 'carlos@test.com' },
                    rol: { type: 'string', example: 'admin' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Usuario actualizado exitosamente' }
          }
        },
        delete: {
          summary: 'Eliminar usuario (Solo Admin)',
          tags: ['Usuarios'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            '200': { description: 'Usuario eliminado' }
          }
        }
      },

      // ==========================================
      // CATEGORÍAS
      // ==========================================
      '/api/categorias': {
        get: {
          summary: 'Obtener todas las categorías (Solo Admin)',
          tags: ['Categorías'],
          responses: {
            '200': { description: 'Lista de categorías' }
          }
        },
        post: {
          summary: 'Crear una nueva categoría (Solo Admin)',
          tags: ['Categorías'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Tecnología y Gadgets' }
                  },
                  required: ['nombre']
                }
              }
            }
          },
          responses: {
            '201': { description: 'Categoría creada con éxito' }
          }
        }
      },
      '/api/categorias/{id}': {
        get: {
          summary: 'Obtener categoría por ID (Solo Admin)',
          tags: ['Categorías'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Detalle de la categoría' } }
        },
        put: {
          summary: 'Actualizar categoría (Solo Admin)',
          tags: ['Categorías'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { nombre: { type: 'string', example: 'Innovación' } }
                }
              }
            }
          },
          responses: { '200': { description: 'Categoría actualizada' } }
        },
        delete: {
          summary: 'Eliminar categoría (Solo Admin)',
          tags: ['Categorías'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Categoría eliminada' } }
        }
      },

      // ==========================================
      // PRODUCTOS
      // ==========================================
      '/api/productos': {
        get: {
          summary: 'Obtener todos los productos (Admin y Usuario)',
          tags: ['Productos'],
          responses: { '200': { description: 'Lista de productos con su categoría' } }
        },
        post: {
          summary: 'Crear un nuevo producto (Solo Admin)',
          tags: ['Productos'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    codigo: { type: 'string', example: 'P001' },
                    nombre: { type: 'string', example: 'Teclado Mecánico' },
                    id_categoria: { type: 'integer', example: 1 },
                    precio_venta: { type: 'number', example: 45.50 },
                    stock_actual: { type: 'integer', example: 10 }
                  },
                  required: ['codigo', 'nombre', 'id_categoria', 'precio_venta', 'stock_actual']
                }
              }
            }
          },
          responses: { '201': { description: 'Producto creado exitosamente' } }
        }
      },
      '/api/productos/{id}': {
        get: {
          summary: 'Obtener producto por ID',
          tags: ['Productos'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Detalle del producto' } }
        },
        put: {
          summary: 'Actualizar producto (Solo Admin)',
          tags: ['Productos'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    codigo: { type: 'string', example: 'P001' },
                    nombre: { type: 'string', example: 'Teclado RGB' },
                    id_categoria: { type: 'integer', example: 1 },
                    precio_venta: { type: 'number', example: 50.00 },
                    stock_actual: { type: 'integer', example: 15 }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Producto actualizado' } }
        },
        delete: {
          summary: 'Eliminar producto (Solo Admin)',
          tags: ['Productos'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Producto eliminado' } }
        }
      },

      // ==========================================
      // COMPRAS
      // ==========================================
      '/api/compras': {
        get: {
          summary: 'Obtener historial de compras (Solo Admin)',
          tags: ['Compras'],
          responses: { '200': { description: 'Historial de compras de inventario' } }
        },
        post: {
          summary: 'Registrar una compra y sumar stock automáticamente (Solo Admin)',
          tags: ['Compras'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id_producto: { type: 'integer', example: 1 },
                    cantidad: { type: 'integer', example: 25 },
                    precio_costo: { type: 'number', example: 20.00 }
                  },
                  required: ['id_producto', 'cantidad', 'precio_costo']
                }
              }
            }
          },
          responses: { '201': { description: 'Compra registrada e inventario sumado' } }
        }
      },

      // ==========================================
      // VENTAS
      // ==========================================
      '/api/ventas': {
        get: {
          summary: 'Obtener historial de ventas',
          tags: ['Ventas'],
          responses: { '200': { description: 'Historial de ventas y sus detalles' } }
        },
        post: {
          summary: 'Registrar una venta y descontar stock transaccionalmente',
          tags: ['Ventas'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id_producto: { type: 'integer', example: 1 },
                          cantidad: { type: 'integer', example: 2 }
                        },
                        required: ['id_producto', 'cantidad']
                      }
                    }
                  },
                  required: ['items']
                }
              }
            }
          },
          responses: {
            '201': { description: 'Venta realizada con éxito' },
            '400': { description: 'Stock insuficiente o producto no disponible' }
          }
        }
      },

      // ==========================================
      // REPORTES
      // ==========================================
      '/api/reportes/usuarios/excel': {
        get: {
          summary: 'Exportar reporte de usuarios a Excel (Solo Admin)',
          tags: ['Reportes'],
          responses: { '200': { description: 'Archivo Excel descargable' } }
        }
      },
      '/api/reportes/usuarios/pdf': {
        get: {
          summary: 'Exportar reporte de usuarios a PDF (Solo Admin)',
          tags: ['Reportes'],
          responses: { '200': { description: 'Archivo PDF descargable' } }
        }
      },
      '/api/reportes/usuarios/csv': {
        get: {
          summary: 'Exportar reporte de usuarios a CSV (Solo Admin)',
          tags: ['Reportes'],
          responses: { '200': { description: 'Archivo CSV descargable' } }
        }
      },
      '/api/reportes/productos/excel': {
        get: {
          summary: 'Exportar reporte de productos a Excel (Solo Admin)',
          tags: ['Reportes'],
          responses: { '200': { description: 'Archivo Excel descargable' } }
        }
      },
      '/api/reportes/productos/pdf': {
        get: {
          summary: 'Exportar reporte de productos a PDF (Solo Admin)',
          tags: ['Reportes'],
          responses: { '200': { description: 'Archivo PDF descargable' } }
        }
      },
      '/api/reportes/categorias/excel': {
        get: {
          summary: 'Exportar reporte de categorías a Excel (Solo Admin)',
          tags: ['Reportes'],
          responses: { '200': { description: 'Archivo Excel descargable' } }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // 1. Ruta para exponer el JSON puro
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // 2. Ruta para la interfaz gráfica de Swagger UI  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Documentación de Swagger disponible en http://localhost:3000/api-docs');
};

module.exports = swaggerDocs;