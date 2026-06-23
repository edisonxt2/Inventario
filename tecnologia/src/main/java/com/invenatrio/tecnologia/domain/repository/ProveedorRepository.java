package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    boolean existsByNombre(String nombre);
}
