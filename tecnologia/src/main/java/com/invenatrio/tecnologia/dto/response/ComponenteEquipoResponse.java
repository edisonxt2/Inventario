package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.TipoComponente;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComponenteEquipoResponse {
    private Long id;
    private TipoComponente tipo;
    private String serial;
    private String observaciones;
}
