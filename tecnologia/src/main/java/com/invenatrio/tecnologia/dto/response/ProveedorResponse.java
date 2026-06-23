package com.invenatrio.tecnologia.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProveedorResponse {
    private Long id;
    private String nombre;
}
