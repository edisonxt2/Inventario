package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.AsignacionEquipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AsignacionEquipoRepository extends JpaRepository<AsignacionEquipo, Long> {
    Optional<AsignacionEquipo> findByEquipoIdAndActivaTrue(Long equipoId);
    List<AsignacionEquipo> findByActivaTrue();
    List<AsignacionEquipo> findByUsuarioIdAndActivaTrue(Long usuarioId);
}
