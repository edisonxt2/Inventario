# Prompt para desarrollo del Frontend (React SPA)

Copia todo el contenido de la sección **PROMPT** y pégalo en Cursor/IA para generar el frontend conectado al backend existente.

---

## PROMPT

Desarrolla una Single Page Application (SPA) en **React** (con TypeScript) para el **Sistema de Inventario de Equipos Tecnológicos en Renting**. El backend **ya está implementado** en Spring Boot y expone una API REST en JSON. **NO modificar el backend.** Solo crear el frontend que consuma la API.

---

### Stack frontend recomendado

- React 18+ con TypeScript
- Vite como bundler
- React Router para navegación
- Axios o fetch con interceptor JWT
- React Query (TanStack Query) para estado de servidor
- UI: Tailwind CSS + componentes (shadcn/ui o similar)
- Formularios: React Hook Form + Zod
- Tablas con filtros/búsqueda local
- Charts para dashboard (Recharts o similar)

---

### Conexión con el backend

| Configuración | Valor |
|---------------|-------|
| Base URL API | `http://localhost:8080` |
| Puerto backend | `8080` |
| Formato | JSON (`Content-Type: application/json`) |
| Autenticación | JWT Bearer Token |
| Header auth | `Authorization: Bearer <token>` |
| CORS | Habilitado para todos los orígenes |

---

### Autenticación

#### Login (público)
```
POST /api/auth/login
Body: { "username": string, "password": string }
Response 200: {
  "token": string,
  "username": string,
  "rol": "ADMIN" | "EDITOR" | "LECTOR"
}
Response 401: { "timestamp": string, "status": 401, "message": "Credenciales inválidas" }
```

**Usuarios de prueba:**
| Username | Password | Rol |
|----------|----------|-----|
| admin | admin123 | ADMIN |
| editor | editor123 | EDITOR |
| lector | lector123 | LECTOR |

**Flujo frontend:**
1. Pantalla de login → POST login
2. Guardar `token`, `username` y `rol` en localStorage o sessionStorage
3. Interceptor Axios: agregar `Authorization: Bearer ${token}` en cada request
4. Si respuesta 401 → limpiar sesión y redirigir a login
5. Proteger rutas según rol del usuario

#### Gestión usuarios del sistema (solo ADMIN)
```
POST   /api/auth/usuarios-sistema
GET    /api/auth/usuarios-sistema
PATCH  /api/auth/usuarios-sistema/{id}/desactivar

Body POST: { "username": string, "password": string, "rol": "ADMIN"|"EDITOR"|"LECTOR" }
Response: { "id": number, "username": string, "rol": string, "activo": boolean }
```

---

### Roles y permisos en UI

| Rol | Puede ver | Puede crear/editar/eliminar |
|-----|-----------|----------------------------|
| ADMIN | Todo | Todo + usuarios del sistema |
| EDITOR | Todo | Equipos, monitores, usuarios, asignaciones, bajas, documentos |
| LECTOR | Inventario, dashboard, reportes, historial (GET) | Nada (ocultar botones de acción) |

**Regla de seguridad backend:** GET en `/api/**` permite ADMIN, EDITOR, LECTOR. POST/PUT/PATCH/DELETE requiere ADMIN o EDITOR.

---

### Enums (usar exactamente estos valores)

```typescript
type RolSistema = 'ADMIN' | 'EDITOR' | 'LECTOR';
type EstadoEquipo = 'EN_BODEGA' | 'ASIGNADO' | 'PENDIENTE_DEVOLUCION' | 'ROBADO_EN_BUSQUEDA' | 'DEVUELTO_PROVEEDOR';
type EstadoMonitor = 'EN_BODEGA' | 'ASIGNADO' | 'DEVUELTO_PROVEEDOR';
type EstadoUsuario = 'ACTIVO' | 'RETIRADO';
type TipoEquipo = 'LAPTOP' | 'DESKTOP';
type TipoComponente = 'CARGADOR' | 'MULTIPUERTO' | 'MOUSE' | 'TECLADO' | 'MALETIN';
type TipoEntidad = 'EQUIPO' | 'MONITOR';
type TipoMovimiento = 'CREACION' | 'MODIFICACION' | 'ASIGNACION' | 'DESASIGNACION' | 'CAMBIO_USUARIO' | 'CAMBIO_ESTADO' | 'BAJA' | 'REEMPLAZO_PERIFERICO';
```

---

### Tipos TypeScript (DTOs)

```typescript
// --- Auth ---
interface LoginRequest { username: string; password: string; }
interface AuthResponse { token: string; username: string; rol: RolSistema; }

// --- Proveedor ---
interface ProveedorRequest { nombre: string; }
interface ProveedorResponse { id: number; nombre: string; }

// --- Centro de Costo ---
interface CentroCostoRequest { codigo: string; nombre: string; }
interface CentroCostoResponse { id: number; codigo: string; nombre: string; }

// --- Contrato Renting ---
interface ContratoRentingRequest {
  numeroContrato: string;
  proveedorId: number;
  fechaInicio: string; // "YYYY-MM-DD"
  fechaFin: string;
}
interface ContratoRentingResponse {
  id: number;
  numeroContrato: string;
  proveedorId: number;
  proveedorNombre: string;
  fechaInicio: string;
  fechaFin: string;
}

// --- Usuario (empleado) ---
interface UsuarioRequest {
  documento: string;
  nombre: string;
  correo: string;
  centroCostoId: number;
  estado: EstadoUsuario;
}
interface UsuarioResponse {
  id: number;
  documento: string;
  nombre: string;
  correo: string;
  centroCostoId: number;
  centroCostoNombre: string;
  estado: EstadoUsuario;
}

// --- Componente de Equipo ---
interface ComponenteEquipoRequest {
  tipo: TipoComponente;
  serial?: string;
  observaciones?: string;
}
interface ComponenteEquipoResponse {
  id: number;
  tipo: TipoComponente;
  serial?: string;
  observaciones?: string;
}

// --- Equipo ---
interface EquipoRequest {
  placa: string;
  serial: string;
  tipo: TipoEquipo;
  marca: string;
  modelo: string;
  procesador?: string;
  ram?: string;
  almacenamiento?: string;
  sistemaOperativo?: string;
  estado?: EstadoEquipo;
  fechaIngreso: string;
  valorMensual: number;
  observaciones?: string;
  proveedorId: number;
  contratoId: number;
  componentes?: ComponenteEquipoRequest[];
}
interface EquipoResponse {
  id: number;
  placa: string;
  serial: string;
  tipo: TipoEquipo;
  marca: string;
  modelo: string;
  procesador?: string;
  ram?: string;
  almacenamiento?: string;
  sistemaOperativo?: string;
  estado: EstadoEquipo;
  fechaIngreso: string;
  valorMensual: number;
  observaciones?: string;
  proveedorId: number;
  proveedorNombre: string;
  contratoId: number;
  numeroContrato: string;
  usuarioAsignadoId?: number;
  usuarioAsignadoNombre?: string;
  componentes: ComponenteEquipoResponse[];
}

// --- Monitor ---
interface MonitorRequest {
  placa: string;
  serial: string;
  marca: string;
  modelo: string;
  estado?: EstadoMonitor;
  proveedorId: number;
}
interface MonitorResponse {
  id: number;
  placa: string;
  serial: string;
  marca: string;
  modelo: string;
  estado: EstadoMonitor;
  proveedorId: number;
  proveedorNombre: string;
  usuarioAsignadoId?: number;
  usuarioAsignadoNombre?: string;
}

// --- Asignación ---
interface AsignacionRequest {
  activoId: number;   // ID del equipo o monitor
  usuarioId: number;  // ID del usuario (empleado)
  observacion?: string;
}

// --- Cambio estado equipo ---
interface CambioEstadoEquipoRequest {
  estado: EstadoEquipo;
  observacion?: string;
}

// --- Reemplazo componente ---
interface ReemplazoComponenteRequest {
  tipo: TipoComponente;
  serialAnterior?: string;
  serialNuevo?: string;
  observacion?: string;
}

// --- Baja ---
interface BajaRequest { observacion?: string; }

// --- Historial ---
interface HistorialMovimientoResponse {
  id: number;
  entidadTipo: TipoEntidad;
  entidadId: number;
  fechaHora: string; // ISO datetime
  usuarioSistema: string;
  tipoMovimiento: TipoMovimiento;
  observacion?: string;
}

// --- Documento baja ---
interface DocumentoBajaResponse {
  id: number;
  entidadTipo: TipoEntidad;
  entidadId: number;
  nombreArchivo: string;
  tipoArchivo: string;
  fechaSubida: string;
}

// --- Dashboard ---
interface CostoProveedorResponse {
  proveedorId: number;
  proveedorNombre: string;
  costoMensual: number;
}
interface CostoCentroCostoResponse {
  centroCostoId: number;
  centroCostoCodigo: string;
  centroCostoNombre: string;
  costoMensual: number;
}
interface DashboardResponse {
  totalEquipos: number;
  totalMonitores: number;
  equiposAsignados: number;
  equiposEnBodega: number;
  monitoresAsignados: number;
  monitoresEnBodega: number;
  equiposDevueltos: number;
  monitoresDevueltos: number;
  costoMensualTotal: number;
  costoPorProveedor: CostoProveedorResponse[];
  costoPorCentroCosto: CostoCentroCostoResponse[];
}

// --- Errores ---
interface ApiError {
  timestamp: string;
  status: number;
  message: string;
}
interface ValidationError {
  timestamp: string;
  status: 400;
  errors: Record<string, string>;
}
```

---

### Catálogo completo de endpoints

#### Proveedores
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/proveedores` | ProveedorRequest | ProveedorResponse |
| GET | `/api/proveedores` | — | ProveedorResponse[] |
| GET | `/api/proveedores/{id}` | — | ProveedorResponse |
| PUT | `/api/proveedores/{id}` | ProveedorRequest | ProveedorResponse |
| DELETE | `/api/proveedores/{id}` | — | 204 |

#### Centros de Costo
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/centros-costo` | CentroCostoRequest | CentroCostoResponse |
| GET | `/api/centros-costo` | — | CentroCostoResponse[] |
| GET | `/api/centros-costo/{id}` | — | CentroCostoResponse |
| PUT | `/api/centros-costo/{id}` | CentroCostoRequest | CentroCostoResponse |
| DELETE | `/api/centros-costo/{id}` | — | 204 |

#### Contratos Renting
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/contratos` | ContratoRentingRequest | ContratoRentingResponse |
| GET | `/api/contratos` | — | ContratoRentingResponse[] |
| GET | `/api/contratos/{id}` | — | ContratoRentingResponse |
| PUT | `/api/contratos/{id}` | ContratoRentingRequest | ContratoRentingResponse |
| DELETE | `/api/contratos/{id}` | — | 204 |

#### Usuarios (empleados)
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/usuarios` | UsuarioRequest | UsuarioResponse |
| GET | `/api/usuarios` | — | UsuarioResponse[] |
| GET | `/api/usuarios/{id}` | — | UsuarioResponse |
| PUT | `/api/usuarios/{id}` | UsuarioRequest | UsuarioResponse |
| DELETE | `/api/usuarios/{id}` | — | 204 |

#### Equipos (solo operativos, excluye DEVUELTO_PROVEEDOR en listado)
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/equipos` | EquipoRequest | EquipoResponse |
| GET | `/api/equipos` | — | EquipoResponse[] (operativos) |
| GET | `/api/equipos/{id}` | — | EquipoResponse |
| PUT | `/api/equipos/{id}` | EquipoRequest | EquipoResponse |
| PATCH | `/api/equipos/{id}/estado` | CambioEstadoEquipoRequest | EquipoResponse |
| POST | `/api/equipos/{id}/componentes/reemplazo` | ReemplazoComponenteRequest | EquipoResponse |
| GET | `/api/equipos/{id}/historial` | — | HistorialMovimientoResponse[] |
| DELETE | `/api/equipos/{id}` | — | 204 |

#### Monitores (solo operativos en listado)
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/monitores` | MonitorRequest | MonitorResponse |
| GET | `/api/monitores` | — | MonitorResponse[] |
| GET | `/api/monitores/{id}` | — | MonitorResponse |
| PUT | `/api/monitores/{id}` | MonitorRequest | MonitorResponse |
| GET | `/api/monitores/{id}/historial` | — | HistorialMovimientoResponse[] |
| DELETE | `/api/monitores/{id}` | — | 204 |

#### Asignaciones
| Método | Ruta | Body / Params | Notas |
|--------|------|---------------|-------|
| POST | `/api/asignaciones/equipos` | AsignacionRequest (`activoId` = equipoId) | |
| POST | `/api/asignaciones/equipos/{equipoId}/desasignar` | Query: `observacion?` | |
| POST | `/api/asignaciones/equipos/{equipoId}/cambiar-usuario` | AsignacionRequest (`usuarioId` = nuevo usuario) | |
| POST | `/api/asignaciones/monitores` | AsignacionRequest (`activoId` = monitorId) | |
| POST | `/api/asignaciones/monitores/{monitorId}/desasignar` | Query: `observacion?` | |
| POST | `/api/asignaciones/monitores/{monitorId}/cambiar-usuario` | AsignacionRequest | |

#### Bajas (devolución a proveedor)
| Método | Ruta | Body | Notas |
|--------|------|------|-------|
| GET | `/api/bajas/equipos` | — | Lista equipos devueltos |
| GET | `/api/bajas/monitores` | — | Lista monitores devueltos |
| POST | `/api/bajas/equipos/{equipoId}` | multipart: `request` (JSON BajaRequest) + `archivo` (file opcional) | PDF/JPEG/PNG max 10MB |
| POST | `/api/bajas/monitores/{monitorId}` | multipart: igual que equipos | |
| GET | `/api/bajas/documentos/{tipo}/{entidadId}` | tipo: EQUIPO\|MONITOR | Lista documentos |
| GET | `/api/bajas/documentos/download/{documentoId}` | — | Descarga archivo (blob) |

**Ejemplo multipart baja:**
```javascript
const formData = new FormData();
formData.append('request', new Blob([JSON.stringify({ observacion: 'Devolución' })], { type: 'application/json' }));
formData.append('archivo', file); // opcional
await axios.post(`/api/bajas/equipos/${id}`, formData, {
  headers: { Authorization: `Bearer ${token}` } // NO poner Content-Type manual
});
```

#### Dashboard
| Método | Ruta | Response |
|--------|------|----------|
| GET | `/api/dashboard` | DashboardResponse |

#### Reportes (todos GET, solo lectura)
| Ruta | Descripción |
|------|-------------|
| `/api/reportes/inventario/equipos` | Inventario operativo equipos |
| `/api/reportes/inventario/monitores` | Inventario operativo monitores |
| `/api/reportes/equipos/por-proveedor/{proveedorId}` | Equipos por proveedor |
| `/api/reportes/monitores/por-proveedor/{proveedorId}` | Monitores por proveedor |
| `/api/reportes/equipos/por-contrato/{contratoId}` | Equipos por contrato |
| `/api/reportes/equipos/por-centro-costo/{centroCostoId}` | Equipos asignados por centro costo |
| `/api/reportes/equipos/asignados` | Todos equipos asignados |
| `/api/reportes/monitores/asignados` | Todos monitores asignados |
| `/api/reportes/equipos/disponibles` | Equipos EN_BODEGA |
| `/api/reportes/monitores/disponibles` | Monitores EN_BODEGA |
| `/api/reportes/activos/devueltos/equipos` | Equipos devueltos |
| `/api/reportes/activos/devueltos/monitores` | Monitores devueltos |
| `/api/reportes/costos/por-proveedor` | Costos mensuales por proveedor |
| `/api/reportes/costos/por-contrato/{contratoId}` | Costo mensual del contrato |
| `/api/reportes/costos/por-centro-costo` | Costos por centro de costo |

---

### Módulos / páginas del frontend

1. **Login** — formulario username/password
2. **Dashboard** — cards con indicadores + gráficos de costos por proveedor y centro de costo
3. **Equipos** — tabla CRUD, detalle con componentes, historial, cambio estado, reemplazo periféricos
4. **Monitores** — tabla CRUD, detalle, historial
5. **Asignaciones** — asignar/desasignar/cambiar usuario para equipos y monitores (select de activos EN_BODEGA y usuarios ACTIVOS)
6. **Bajas** — módulo separado: listar devueltos, registrar baja con upload de certificado, ver/descargar documentos
7. **Usuarios** — CRUD empleados
8. **Proveedores** — CRUD
9. **Centros de Costo** — CRUD
10. **Contratos** — CRUD (select proveedor)
11. **Reportes** — página con filtros y exportación (tablas por tipo de reporte)
12. **Usuarios del Sistema** (solo ADMIN) — crear/desactivar usuarios ADMIN/EDITOR/LECTOR

---

### Reglas de negocio para validación en UI

- Solo mostrar botón "Asignar" si estado = `EN_BODEGA`
- Solo permitir asignar a usuarios con estado `ACTIVO`
- Equipos/monitores `DEVUELTO_PROVEEDOR` NO aparecen en inventario operativo (`GET /api/equipos`, `GET /api/monitores`); solo en módulo Bajas
- Al crear equipo: estado por defecto `EN_BODEGA` si no se envía
- Componentes del equipo: CARGADOR, MULTIPUERTO, MOUSE, TECLADO, MALETIN (no son activos independientes)
- Badge de colores por estado (sugerido):
  - EN_BODEGA → verde
  - ASIGNADO → azul
  - PENDIENTE_DEVOLUCION → amarillo
  - ROBADO_EN_BUSQUEDA → rojo
  - DEVUELTO_PROVEEDOR → gris
- Mostrar `usuarioAsignadoNombre` en tablas cuando el activo está asignado
- En formulario de baja: aceptar solo PDF, JPEG, PNG (max 10MB)

---

### Estructura de carpetas sugerida

```
src/
  api/           # axios instance, endpoints por módulo
  components/    # UI reutilizable (Tabla, Modal, BadgeEstado, etc.)
  contexts/      # AuthContext
  hooks/         # useAuth, usePermisos
  pages/         # cada módulo
  types/         # interfaces TypeScript
  utils/         # formatters, constants (enums)
  routes/        # React Router + guards por rol
```

---

### Ejemplo interceptor Axios

```typescript
const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

### Criterios de aceptación

- [ ] Login con JWT y persistencia de sesión
- [ ] Rutas protegidas por rol
- [ ] CRUD completo de todas las entidades
- [ ] Asignaciones con validación de estados
- [ ] Módulo de bajas con upload de archivos
- [ ] Dashboard con todos los indicadores del backend
- [ ] Página de reportes con los 15 endpoints
- [ ] Historial visible en detalle de equipo/monitor
- [ ] Manejo de errores API (400, 401, 404, 500) con mensajes al usuario
- [ ] UI responsive y profesional para área de IT
- [ ] Variables de entorno: `VITE_API_URL=http://localhost:8080`

---

### Notas importantes

- El backend usa H2 en memoria; reiniciar el servidor borra datos (excepto usuarios del sistema que se re-seedean)
- Fechas en formato ISO: `YYYY-MM-DD` para LocalDate, datetime completo para historial
- Los montos (`valorMensual`, `costoMensual`) son números decimales
- No hay paginación en el backend; implementar filtrado/búsqueda en el cliente o agregar paginación visual
- El proyecto backend está en la carpeta `tecnologia/` del monorepo; el frontend puede crearse en `frontend/` al mismo nivel
