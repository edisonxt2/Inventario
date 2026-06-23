package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.TipoEquipo;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class EquipoResponse {
    private Long id;
    private String placa;
    private String serial;
    private TipoEquipo tipo;
    private String marca;
    private String modelo;
    private String procesador;
    private String ram;
    private String almacenamiento;
    private String sistemaOperativo;
    private EstadoEquipo estado;
    private LocalDate fechaIngreso;
    private BigDecimal valorMensual;
    private String observaciones;
    private Long proveedorId;
    private String proveedorNombre;
    private Long contratoId;
    private String numeroContrato;
    private Long usuarioAsignadoId;
    private String usuarioAsignadoNombre;
    private List<ComponenteEquipoResponse> componentes;
}
