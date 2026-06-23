package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.CentroCosto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CentroCostoRepository extends JpaRepository<CentroCosto, Long> {
    boolean existsByCodigo(String codigo);
}
