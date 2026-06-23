package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DocumentoBajaResponse {
    private Long id;
    private TipoEntidad entidadTipo;
    private Long entidadId;
    private String nombreArchivo;
    private String tipoArchivo;
    private LocalDateTime fechaSubida;
}
