package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MonitorResponse {
    private Long id;
    private String placa;
    private String serial;
    private String marca;
    private String modelo;
    private EstadoMonitor estado;
    private Long proveedorId;
    private String proveedorNombre;
    private Long usuarioAsignadoId;
    private String usuarioAsignadoNombre;
}
