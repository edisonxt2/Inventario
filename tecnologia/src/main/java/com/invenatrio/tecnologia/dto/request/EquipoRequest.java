package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.TipoEquipo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class EquipoRequest {
    @NotBlank
    private String placa;
    @NotBlank
    private String serial;
    @NotNull
    private TipoEquipo tipo;
    @NotBlank
    private String marca;
    @NotBlank
    private String modelo;
    private String procesador;
    private String ram;
    private String almacenamiento;
    private String sistemaOperativo;
    private EstadoEquipo estado;
    @NotNull
    private LocalDate fechaIngreso;
    @NotNull
    @Positive
    private BigDecimal valorMensual;
    private String observaciones;
    @NotNull
    private Long proveedorId;
    @NotNull
    private Long contratoId;
    private List<ComponenteEquipoRequest> componentes;
}
