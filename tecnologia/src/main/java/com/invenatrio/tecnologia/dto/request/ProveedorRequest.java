package com.invenatrio.tecnologia.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProveedorRequest {
    @NotBlank
    private String nombre;
}
