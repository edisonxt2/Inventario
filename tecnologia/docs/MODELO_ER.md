# Modelo Entidad-Relación

## Diagrama

```
┌─────────────────┐       ┌──────────────────┐
│   proveedores   │       │  centros_costo    │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │       │ id (PK)          │
│ nombre (UK)     │       │ codigo (UK)      │
└────────┬────────┘       │ nombre           │
         │                └────────┬───────────┘
         │                         │
         │    ┌────────────────────┘
         │    │
         ▼    ▼
┌─────────────────────┐     ┌─────────────────────┐
│  contratos_renting  │     │      usuarios       │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ numero_contrato (UK)│     │ documento (UK)      │
│ proveedor_id (FK)   │     │ nombre              │
│ fecha_inicio        │     │ correo (UK)         │
│ fecha_fin           │     │ centro_costo_id(FK) │
└──────────┬──────────┘     │ estado              │
           │                └──────────┬────────────┘
           │                         │
           ▼                         │
┌─────────────────────┐             │
│       equipos       │             │
├─────────────────────┤             │
│ id (PK)             │             │
│ placa (UK)          │             │
│ serial (UK)         │             │
│ tipo                │             │
│ marca, modelo       │             │
│ procesador, ram     │             │
│ almacenamiento      │             │
│ sistema_operativo   │             │
│ estado              │             │
│ fecha_ingreso       │             │
│ valor_mensual       │             │
│ observaciones       │             │
│ proveedor_id (FK)   │             │
│ contrato_id (FK)    │             │
└──────────┬──────────┘             │
           │                         │
           │    ┌────────────────────┤
           │    │                    │
           ▼    ▼                    ▼
┌─────────────────────┐   ┌─────────────────────┐
│ componentes_equipo  │   │ asignaciones_equipo │
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ equipo_id (FK)      │   │ equipo_id (FK)      │
│ tipo                │   │ usuario_id (FK)     │
│ serial              │   │ fecha_asignacion    │
│ observaciones       │   │ fecha_desasignacion │
└─────────────────────┘   │ activa              │
                          └─────────────────────┘

┌─────────────────────┐             │
│      monitores      │             │
├─────────────────────┤             │
│ id (PK)             │             │
│ placa (UK)          │             │
│ serial (UK)         │             │
│ marca, modelo       │             │
│ estado              │             │
│ proveedor_id (FK)   │             │
└──────────┬──────────┘             │
           │                         │
           ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐
│ asignaciones_monitor│   │ historial_movimientos│
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ monitor_id (FK)     │   │ entidad_tipo        │
│ usuario_id (FK)     │   │ entidad_id          │
│ fecha_asignacion    │   │ fecha_hora          │
│ fecha_desasignacion │   │ usuario_sistema     │
│ activa              │   │ tipo_movimiento     │
└─────────────────────┘   │ observacion         │
                          └─────────────────────┘

┌─────────────────────┐   ┌─────────────────────┐
│   documentos_baja   │   │  usuarios_sistema   │
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ entidad_tipo        │   │ username (UK)       │
│ entidad_id          │   │ password            │
│ nombre_archivo      │   │ rol                 │
│ tipo_archivo        │   │ activo              │
│ ruta                │   └─────────────────────┘
│ fecha_subida        │
└─────────────────────┘
```

## Estados

| Entidad  | Estados válidos |
|----------|-----------------|
| Equipo   | EN_BODEGA, ASIGNADO, PENDIENTE_DEVOLUCION, ROBADO_EN_BUSQUEDA, DEVUELTO_PROVEEDOR |
| Monitor  | EN_BODEGA, ASIGNADO, DEVUELTO_PROVEEDOR |
| Usuario  | ACTIVO, RETIRADO |

## Roles del sistema

| Rol    | Permisos |
|--------|----------|
| ADMIN  | Acceso total, gestión de usuarios del sistema |
| EDITOR | CRUD de activos, asignaciones, bajas, documentos |
| LECTOR | Solo consulta: inventario, dashboard, reportes |
