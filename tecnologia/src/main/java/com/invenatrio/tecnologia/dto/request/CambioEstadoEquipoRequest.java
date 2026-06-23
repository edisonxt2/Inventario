package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import lombok.Data;

@Data
public class CambioEstadoEquipoRequest {
    private EstadoEquipo estado;
    private String observacion;
}
