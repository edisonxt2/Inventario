package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.HistorialMovimiento;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialMovimientoRepository extends JpaRepository<HistorialMovimiento, Long> {
    List<HistorialMovimiento> findByEntidadTipoAndEntidadIdOrderByFechaHoraDesc(TipoEntidad entidadTipo, Long entidadId);
}
