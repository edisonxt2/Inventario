export type RolSistema = 'ADMIN' | 'EDITOR' | 'LECTOR';
export type EstadoEquipo = 'EN_BODEGA' | 'ASIGNADO' | 'PENDIENTE_DEVOLUCION' | 'ROBADO_EN_BUSQUEDA' | 'DEVUELTO_PROVEEDOR';
export type EstadoMonitor = 'EN_BODEGA' | 'ASIGNADO' | 'DEVUELTO_PROVEEDOR';
export type EstadoUsuario = 'ACTIVO' | 'RETIRADO';
export type TipoEquipo = 'LAPTOP' | 'DESKTOP';
export type TipoComponente = 'CARGADOR' | 'MULTIPUERTO' | 'MOUSE' | 'TECLADO' | 'MALETIN';
export type TipoEntidad = 'EQUIPO' | 'MONITOR';
export type TipoMovimiento = 'CREACION' | 'MODIFICACION' | 'ASIGNACION' | 'DESASIGNACION' | 'CAMBIO_USUARIO' | 'CAMBIO_ESTADO' | 'BAJA' | 'REEMPLAZO_PERIFERICO';

export interface LoginRequest { username: string; password: string; }
export interface AuthResponse { token: string; username: string; rol: RolSistema; }

export interface UsuarioSistemaRequest {
  username: string
  password: string
  rol: RolSistema
}

export interface UsuarioSistemaResponse {
  id: number
  username: string
  rol: RolSistema
  activo: boolean
}

export interface ProveedorRequest { nombre: string; }
export interface ProveedorResponse { id: number; nombre: string; }

export interface CentroCostoRequest { codigo: string; nombre: string; }
export interface CentroCostoResponse { id: number; codigo: string; nombre: string; }

export interface ContratoRentingRequest {
  numeroContrato: string;
  proveedorId: number;
  fechaInicio: string;
  fechaFin: string;
}
export interface ContratoRentingResponse {
  id: number;
  numeroContrato: string;
  proveedorId: number;
  proveedorNombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface UsuarioRequest {
  documento: string;
  nombre: string;
  correo: string;
  centroCostoId: number;
  estado: EstadoUsuario;
}
export interface UsuarioResponse {
  id: number;
  documento: string;
  nombre: string;
  correo: string;
  centroCostoId: number;
  centroCostoNombre: string;
  estado: EstadoUsuario;
}

export interface ComponenteEquipoRequest {
  tipo: TipoComponente;
  serial?: string;
  observaciones?: string;
}
export interface ComponenteEquipoResponse {
  id: number;
  tipo: TipoComponente;
  serial?: string;
  observaciones?: string;
}

export interface EquipoRequest {
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
export interface EquipoResponse {
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

export interface MonitorRequest {
  placa: string;
  serial: string;
  marca: string;
  modelo: string;
  estado?: EstadoMonitor;
  proveedorId: number;
}
export interface MonitorResponse {
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

export interface AsignacionRequest {
  activoId: number;
  usuarioId: number;
  observacion?: string;
}

export interface CambioEstadoEquipoRequest {
  estado: EstadoEquipo;
  observacion?: string;
}

export interface ReemplazoComponenteRequest {
  tipo: TipoComponente;
  serialAnterior?: string;
  serialNuevo?: string;
  observacion?: string;
}

export interface BajaRequest { observacion?: string; }

export interface HistorialMovimientoResponse {
  id: number;
  entidadTipo: TipoEntidad;
  entidadId: number;
  fechaHora: string;
  usuarioSistema: string;
  tipoMovimiento: TipoMovimiento;
  observacion?: string;
}

export interface DocumentoBajaResponse {
  id: number;
  entidadTipo: TipoEntidad;
  entidadId: number;
  nombreArchivo: string;
  tipoArchivo: string;
  fechaSubida: string;
}

export interface CostoProveedorResponse {
  proveedorId: number;
  proveedorNombre: string;
  costoMensual: number;
}
export interface CostoCentroCostoResponse {
  centroCostoId: number;
  centroCostoCodigo: string;
  centroCostoNombre: string;
  costoMensual: number;
}
export interface DashboardResponse {
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

export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
}

export interface ValidationError {
  timestamp: string;
  status: 400;
  errors: Record<string, unknown>;
}
