package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.DocumentoBaja;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoBajaRepository extends JpaRepository<DocumentoBaja, Long> {
    List<DocumentoBaja> findByEntidadTipoAndEntidadId(TipoEntidad entidadTipo, Long entidadId);
}
