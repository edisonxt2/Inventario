package com.invenatrio.tecnologia.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ContratoRentingRequest {
    @NotBlank
    private String numeroContrato;
    @NotNull
    private Long proveedorId;
    @NotNull
    private LocalDate fechaInicio;
    @NotNull
    private LocalDate fechaFin;
}
