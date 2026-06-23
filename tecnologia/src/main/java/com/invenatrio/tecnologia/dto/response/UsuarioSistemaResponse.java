package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.RolSistema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioSistemaResponse {
    private Long id;
    private String username;
    private RolSistema rol;
    private boolean activo;
}
