package com.invenatrio.tecnologia.domain.entity;

import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documentos_baja")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoBaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEntidad entidadTipo;

    @Column(nullable = false)
    private Long entidadId;

    @Column(nullable = false)
    private String nombreArchivo;

    @Column(nullable = false)
    private String tipoArchivo;

    @Column(nullable = false)
    private String ruta;

    @Column(nullable = false)
    private LocalDateTime fechaSubida;
}
