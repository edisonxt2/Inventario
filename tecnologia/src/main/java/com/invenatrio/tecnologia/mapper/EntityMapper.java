package com.invenatrio.tecnologia.mapper;

import com.invenatrio.tecnologia.domain.entity.*;
import com.invenatrio.tecnologia.dto.response.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EntityMapper {

    public ProveedorResponse toResponse(Proveedor entity) {
        return ProveedorResponse.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .build();
    }

    public CentroCostoResponse toResponse(CentroCosto entity) {
        return CentroCostoResponse.builder()
                .id(entity.getId())
                .codigo(entity.getCodigo())
                .nombre(entity.getNombre())
                .build();
    }

    public ContratoRentingResponse toResponse(ContratoRenting entity) {
        return ContratoRentingResponse.builder()
                .id(entity.getId())
                .numeroContrato(entity.getNumeroContrato())
                .proveedorId(entity.getProveedor().getId())
                .proveedorNombre(entity.getProveedor().getNombre())
                .fechaInicio(entity.getFechaInicio())
                .fechaFin(entity.getFechaFin())
                .build();
    }

    public UsuarioResponse toResponse(Usuario entity) {
        return UsuarioResponse.builder()
                .id(entity.getId())
                .documento(entity.getDocumento())
                .nombre(entity.getNombre())
                .correo(entity.getCorreo())
                .centroCostoId(entity.getCentroCosto().getId())
                .centroCostoNombre(entity.getCentroCosto().getNombre())
                .estado(entity.getEstado())
                .build();
    }

    public UsuarioSistemaResponse toResponse(UsuarioSistema entity) {
        return UsuarioSistemaResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .rol(entity.getRol())
                .activo(entity.isActivo())
                .build();
    }

    public ComponenteEquipoResponse toResponse(ComponenteEquipo entity) {
        return ComponenteEquipoResponse.builder()
                .id(entity.getId())
                .tipo(entity.getTipo())
                .serial(entity.getSerial())
                .observaciones(entity.getObservaciones())
                .build();
    }

    public EquipoResponse toResponse(Equipo entity, Usuario usuarioAsignado) {
        List<ComponenteEquipoResponse> componentes = entity.getComponentes().stream()
                .map(this::toResponse)
                .toList();

        EquipoResponse.EquipoResponseBuilder builder = EquipoResponse.builder()
                .id(entity.getId())
                .placa(entity.getPlaca())
                .serial(entity.getSerial())
                .tipo(entity.getTipo())
                .marca(entity.getMarca())
                .modelo(entity.getModelo())
                .procesador(entity.getProcesador())
                .ram(entity.getRam())
                .almacenamiento(entity.getAlmacenamiento())
                .sistemaOperativo(entity.getSistemaOperativo())
                .estado(entity.getEstado())
                .fechaIngreso(entity.getFechaIngreso())
                .valorMensual(entity.getValorMensual())
                .observaciones(entity.getObservaciones())
                .proveedorId(entity.getProveedor().getId())
                .proveedorNombre(entity.getProveedor().getNombre())
                .contratoId(entity.getContrato().getId())
                .numeroContrato(entity.getContrato().getNumeroContrato())
                .componentes(componentes);

        if (usuarioAsignado != null) {
            builder.usuarioAsignadoId(usuarioAsignado.getId())
                    .usuarioAsignadoNombre(usuarioAsignado.getNombre());
        }

        return builder.build();
    }

    public MonitorResponse toResponse(Monitor entity, Usuario usuarioAsignado) {
        MonitorResponse.MonitorResponseBuilder builder = MonitorResponse.builder()
                .id(entity.getId())
                .placa(entity.getPlaca())
                .serial(entity.getSerial())
                .marca(entity.getMarca())
                .modelo(entity.getModelo())
                .estado(entity.getEstado())
                .proveedorId(entity.getProveedor().getId())
                .proveedorNombre(entity.getProveedor().getNombre());

        if (usuarioAsignado != null) {
            builder.usuarioAsignadoId(usuarioAsignado.getId())
                    .usuarioAsignadoNombre(usuarioAsignado.getNombre());
        }

        return builder.build();
    }

    public HistorialMovimientoResponse toResponse(HistorialMovimiento entity) {
        return HistorialMovimientoResponse.builder()
                .id(entity.getId())
                .entidadTipo(entity.getEntidadTipo())
                .entidadId(entity.getEntidadId())
                .fechaHora(entity.getFechaHora())
                .usuarioSistema(entity.getUsuarioSistema())
                .tipoMovimiento(entity.getTipoMovimiento())
                .observacion(entity.getObservacion())
                .build();
    }

    public DocumentoBajaResponse toResponse(DocumentoBaja entity) {
        return DocumentoBajaResponse.builder()
                .id(entity.getId())
                .entidadTipo(entity.getEntidadTipo())
                .entidadId(entity.getEntidadId())
                .nombreArchivo(entity.getNombreArchivo())
                .tipoArchivo(entity.getTipoArchivo())
                .fechaSubida(entity.getFechaSubida())
                .build();
    }
}
