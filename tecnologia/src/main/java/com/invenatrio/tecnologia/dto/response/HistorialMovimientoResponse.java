package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.domain.enums.TipoMovimiento;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistorialMovimientoResponse {
    private Long id;
    private TipoEntidad entidadTipo;
    private Long entidadId;
    private LocalDateTime fechaHora;
    private String usuarioSistema;
    private TipoMovimiento tipoMovimiento;
    private String observacion;
}
