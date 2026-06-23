package com.invenatrio.tecnologia.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private long totalEquipos;
    private long totalMonitores;
    private long equiposAsignados;
    private long equiposEnBodega;
    private long monitoresAsignados;
    private long monitoresEnBodega;
    private long equiposDevueltos;
    private long monitoresDevueltos;
    private BigDecimal costoMensualTotal;
    private List<CostoProveedorResponse> costoPorProveedor;
    private List<CostoCentroCostoResponse> costoPorCentroCosto;
}
