package com.invenatrio.tecnologia.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AsignacionRequest {
    @NotNull
    private Long activoId;
    @NotNull
    private Long usuarioId;
    private String observacion;
}
