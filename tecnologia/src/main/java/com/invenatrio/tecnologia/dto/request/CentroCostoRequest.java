package com.invenatrio.tecnologia.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CentroCostoRequest {
    @NotBlank
    private String codigo;
    @NotBlank
    private String nombre;
}
