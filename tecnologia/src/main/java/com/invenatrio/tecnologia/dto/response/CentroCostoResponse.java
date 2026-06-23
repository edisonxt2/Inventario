package com.invenatrio.tecnologia.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CentroCostoResponse {
    private Long id;
    private String codigo;
    private String nombre;
}
