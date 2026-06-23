package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.RolSistema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioSistemaRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotNull
    private RolSistema rol;
}
