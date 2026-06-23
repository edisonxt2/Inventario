package com.invenatrio.tecnologia.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ContratoRentingResponse {
    private Long id;
    private String numeroContrato;
    private Long proveedorId;
    private String proveedorNombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
