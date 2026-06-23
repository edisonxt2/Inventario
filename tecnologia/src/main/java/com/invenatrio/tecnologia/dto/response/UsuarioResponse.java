package com.invenatrio.tecnologia.dto.response;

import com.invenatrio.tecnologia.domain.enums.EstadoUsuario;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String documento;
    private String nombre;
    private String correo;
    private Long centroCostoId;
    private String centroCostoNombre;
    private EstadoUsuario estado;
}
