package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.TipoComponente;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReemplazoComponenteRequest {
    @NotNull
    private TipoComponente tipo;
    private String serialAnterior;
    private String serialNuevo;
    private String observacion;
}
