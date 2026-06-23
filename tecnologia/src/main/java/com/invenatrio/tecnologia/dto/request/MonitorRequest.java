package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MonitorRequest {
    @NotBlank
    private String placa;
    @NotBlank
    private String serial;
    @NotBlank
    private String marca;
    @NotBlank
    private String modelo;
    private EstadoMonitor estado;
    @NotNull
    private Long proveedorId;
}
