package com.invenatrio.tecnologia.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CostoProveedorResponse {
    private Long proveedorId;
    private String proveedorNombre;
    private BigDecimal costoMensual;
}
