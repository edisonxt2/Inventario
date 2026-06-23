package com.invenatrio.tecnologia.domain.entity;

import com.invenatrio.tecnologia.domain.enums.TipoComponente;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "componentes_equipo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComponenteEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoComponente tipo;

    private String serial;

    private String observaciones;
}
