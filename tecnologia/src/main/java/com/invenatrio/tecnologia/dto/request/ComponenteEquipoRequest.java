package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.TipoComponente;
import lombok.Data;

@Data
public class ComponenteEquipoRequest {
    private TipoComponente tipo;
    private String serial;
    private String observaciones;
}
