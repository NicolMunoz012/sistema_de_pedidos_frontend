# 🔌 Conexión con Backend - Progreso

## ✅ Servicios Actualizados con Endpoints Reales

### 1. AuthService (lib/services/authService.ts)
```typescript
✅ POST /usuarios/registro - Registro de usuario
✅ POST /usuarios/login?gmail=x&contraseña=x - Login con query params
✅ POST /usuarios/recuperar?gmail=x - Recuperar contraseña
✅ POST /usuarios/logout/{idUsuario} - Logout
✅ GET /usuarios/{idUsuario} - Obtener usuario
✅ PUT /usuarios/{idUsuario} - Actualizar usuario
✅ PUT /usuarios/{idUsuario}/cambiar-contraseña?contraseñaAntigua=X&contraseñaNueva=Y - Cambiar contraseña
```

### 2. ItemService (lib/services/itemService.ts)
```typescript
✅ GET /items - Listar todos los items
✅ GET /items/{idItem} - Obtener item por ID
✅ GET /items/categoria/{categoria} - Filtrar por categoría
✅ GET /items/buscar?textoBusqueda=x - Buscar items
✅ POST /items - Crear item (admin)
✅ PUT /items/{idItem} - Actualizar item (admin)
✅ DELETE /items/{idItem} - Eliminar item (admin)
✅ PUT /items/{idItem}/disponibilidad?disponible=true/false - Cambiar disponibilidad
```

## ✅ Componentes Actualizados

### Cliente
- ✅ **Login** - Usa endpoint correcto con query params
- ✅ **ListaItems** - Incluye buscador de items
- ✅ **Perfil** - Página completa con edición de perfil y cambio de contraseña

### Admin
- ✅ **AdministrarMenu** - Usa idItem en lugar de nombre para operaciones

## ✅ Tipos Actualizados
- ✅ Item ahora incluye `idItem?: string`
- ✅ AuthContext usa logout correcto del backend

## 📋 Páginas Creadas

### Cliente
- ✅ `/perfil` - Perfil de usuario con tabs para:
  - Información personal (nombre, email, dirección)
  - Cambiar contraseña

## 🔄 Pendiente de Actualizar

### Servicios que Faltan Endpoints Reales

#### PedidoService
Necesito los endpoints reales del PedidoController para actualizar:
- Crear pedido
- Obtener pedido
- Listar pedidos
- Agregar/eliminar items del pedido
- Confirmar pedido
- Cancelar pedido
- Actualizar estado (admin)

#### FacturaService
Necesito los endpoints reales del FacturaController para actualizar:
- Generar factura
- Obtener factura
- Listar facturas
- Facturas por usuario
- Filtrar por fecha

## 📝 Próximos Pasos

### 1. Actualizar PedidoService y FacturaService
Una vez que me proporciones los endpoints reales de:
- PedidoController
- FacturaController

Actualizaré los servicios correspondientes.

### 2. Crear/Actualizar Páginas Faltantes

#### Para Cliente:
- Actualizar página de pedidos
- Actualizar historial de pedidos
- Actualizar página de facturas

#### Para Admin:
- Actualizar gestión de pedidos
- Actualizar gestión de facturas

### 3. Implementar Roles
- Agregar campo `rol` al tipo Usuario
- Proteger rutas de admin
- Mostrar/ocultar opciones según rol

## 🎯 Estructura de Roles Propuesta

```typescript
interface Usuario {
  idUsuario?: string;
  nombre: string;
  gmail: string;
  contraseña: string;
  direccion: string;
  rol?: 'CLIENTE' | 'ADMINISTRADOR'; // Nuevo campo
}
```

## 📱 Rutas por Rol

### Cliente
- `/menu` - Ver menú y buscar items
- `/pedido` - Crear y gestionar pedido
- `/historial` - Ver mis pedidos
- `/facturas` - Ver mis facturas
- `/perfil` - Editar perfil y cambiar contraseña

### Administrador
- `/admin` - Panel de administración con tabs:
  - Gestión de Items (CRUD)
  - Gestión de Pedidos (ver todos, cambiar estado)
  - Gestión de Facturas (generar, ver todas)

## 🔧 Configuración Actual

### Variables de Entorno (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Axios Configuration (lib/api.ts)
- Base URL configurable
- Interceptor para agregar token JWT
- Interceptor para manejar errores 401

## ✨ Mejoras Implementadas

1. **Búsqueda de Items** - Los clientes pueden buscar platillos por texto
2. **Cambio de Contraseña** - Los usuarios pueden cambiar su contraseña desde el perfil
3. **Validaciones** - Mensajes de error claros en todos los formularios
4. **Loading States** - Indicadores de carga en todas las operaciones
5. **Manejo de Errores** - Try-catch en todos los servicios con mensajes al usuario

## 🚀 Para Continuar

Por favor proporciona los endpoints reales de:

1. **PedidoController** - Todos los endpoints con sus parámetros exactos
2. **FacturaController** - Todos los endpoints con sus parámetros exactos

Y especifica si el Usuario tiene un campo `rol` en el backend para implementar la protección de rutas.
