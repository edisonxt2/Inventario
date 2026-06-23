package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.ComponenteEquipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComponenteEquipoRepository extends JpaRepository<ComponenteEquipo, Long> {
    List<ComponenteEquipo> findByEquipoId(Long equipoId);
}
