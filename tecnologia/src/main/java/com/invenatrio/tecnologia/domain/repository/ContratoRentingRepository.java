package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.ContratoRenting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContratoRentingRepository extends JpaRepository<ContratoRenting, Long> {
    boolean existsByNumeroContrato(String numeroContrato);
    List<ContratoRenting> findByProveedorId(Long proveedorId);
}
