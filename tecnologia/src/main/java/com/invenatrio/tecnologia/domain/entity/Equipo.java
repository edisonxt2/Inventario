package com.invenatrio.tecnologia.domain.entity;

import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.TipoEquipo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String placa;

    @Column(nullable = false, unique = true)
    private String serial;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEquipo tipo;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    private String procesador;

    private String ram;

    private String almacenamiento;

    private String sistemaOperativo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEquipo estado;

    @Column(nullable = false)
    private LocalDate fechaIngreso;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorMensual;

    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrato_id", nullable = false)
    private ContratoRenting contrato;

    @OneToMany(mappedBy = "equipo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComponenteEquipo> componentes = new ArrayList<>();
}
