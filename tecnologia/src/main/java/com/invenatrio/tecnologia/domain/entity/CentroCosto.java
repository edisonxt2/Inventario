package com.invenatrio.tecnologia.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "centros_costo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CentroCosto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String nombre;
}
