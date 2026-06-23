package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.AsignacionMonitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AsignacionMonitorRepository extends JpaRepository<AsignacionMonitor, Long> {
    Optional<AsignacionMonitor> findByMonitorIdAndActivaTrue(Long monitorId);
    List<AsignacionMonitor> findByActivaTrue();
    List<AsignacionMonitor> findByUsuarioIdAndActivaTrue(Long usuarioId);
}
