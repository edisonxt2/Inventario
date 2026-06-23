package com.invenatrio.tecnologia.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CostoCentroCostoResponse {
    private Long centroCostoId;
    private String centroCostoCodigo;
    private String centroCostoNombre;
    private BigDecimal costoMensual;
}
