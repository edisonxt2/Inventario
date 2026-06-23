package com.invenatrio.tecnologia.dto.request;

import com.invenatrio.tecnologia.domain.enums.EstadoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRequest {
    @NotBlank
    private String documento;
    @NotBlank
    private String nombre;
    @NotBlank
    @Email
    private String correo;
    @NotNull
    private Long centroCostoId;
    @NotNull
    private EstadoUsuario estado;
}
