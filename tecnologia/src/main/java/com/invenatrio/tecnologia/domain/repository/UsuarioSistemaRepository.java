package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.UsuarioSistema;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioSistemaRepository extends JpaRepository<UsuarioSistema, Long> {
    Optional<UsuarioSistema> findByUsername(String username);
    boolean existsByUsername(String username);
}
