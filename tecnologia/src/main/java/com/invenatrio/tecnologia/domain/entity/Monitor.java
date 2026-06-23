package com.invenatrio.tecnologia.domain.entity;

import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "monitores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Monitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String placa;

    @Column(nullable = false, unique = true)
    private String serial;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMonitor estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;
}
