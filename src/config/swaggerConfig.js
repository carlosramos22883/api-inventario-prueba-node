const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Inventario - Prueba Técnica',
      version: '1.0.0',
      description: 'Documentación oficial de la API backend desarrollada con Node.js, Express y Sequelize.',
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
      '/api/productos': {
        get: {
          summary: 'Obtener todos los productos',
          tags: ['Productos'],
          responses: {
            '200': { description: 'Lista de productos obtenida correctamente' },
            '401': { description: 'No autorizado / Token faltante' }
          }
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
          responses: {
            '201': { description: 'Producto creado con éxito' },
            '403': { description: 'Prohibido - Se requiere rol admin' }
          }
        }
      },
      '/api/categorias': {
        get: {
          summary: 'Obtener todas las categorías (Solo Admin)',
          tags: ['Categorías'],
          responses: {
            '200': { description: 'Lista de categorías' },
            '403': { description: 'Acceso denegado' }
          }
        }
      },
      '/api/compras': {
        post: {
          summary: 'Registrar una compra y sumar stock (Solo Admin)',
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
          responses: {
            '201': { description: 'Compra registrada e inventario actualizado' }
          }
        }
      },
      '/api/ventas': {
        post: {
          summary: 'Registrar una venta y descontar stock',
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
                        }
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
      }
    }
  },
  apis: [] // No dependemos de archivos externos de JSDoc, todo está centralizado aquí limpio y sin errores.
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Documentación de Swagger disponible en http://localhost:3000/api-docs');
};

module.exports = swaggerDocs;