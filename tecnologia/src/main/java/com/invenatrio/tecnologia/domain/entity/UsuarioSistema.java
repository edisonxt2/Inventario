package com.invenatrio.tecnologia.domain.entity;

import com.invenatrio.tecnologia.domain.enums.RolSistema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios_sistema")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolSistema rol;

    @Column(nullable = false)
    @Builder.Default
    private boolean activo = true;
}
