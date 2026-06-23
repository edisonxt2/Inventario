package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.Monitor;
import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MonitorRepository extends JpaRepository<Monitor, Long> {
    boolean existsByPlaca(String placa);
    boolean existsBySerial(String serial);
    List<Monitor> findByEstado(EstadoMonitor estado);
    List<Monitor> findByProveedorId(Long proveedorId);

    @Query("SELECT m FROM Monitor m WHERE m.estado <> com.invenatrio.tecnologia.domain.enums.EstadoMonitor.DEVUELTO_PROVEEDOR")
    List<Monitor> findOperativos();

    @Query("SELECT m FROM Monitor m WHERE m.estado = com.invenatrio.tecnologia.domain.enums.EstadoMonitor.DEVUELTO_PROVEEDOR")
    List<Monitor> findDevueltos();

    @Query("SELECT m FROM Monitor m WHERE m.estado = com.invenatrio.tecnologia.domain.enums.EstadoMonitor.EN_BODEGA")
    List<Monitor> findDisponibles();

    long countByEstado(EstadoMonitor estado);
}
