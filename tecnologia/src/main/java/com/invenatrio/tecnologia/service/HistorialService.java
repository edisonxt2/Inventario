package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.HistorialMovimiento;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.domain.enums.TipoMovimiento;
import com.invenatrio.tecnologia.domain.repository.HistorialMovimientoRepository;
import com.invenatrio.tecnologia.dto.response.HistorialMovimientoResponse;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import com.invenatrio.tecnologia.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialService {

    private final HistorialMovimientoRepository historialRepository;
    private final EntityMapper mapper;

    @Transactional
    public void registrar(TipoEntidad entidadTipo, Long entidadId, TipoMovimiento tipoMovimiento, String observacion) {
        HistorialMovimiento historial = HistorialMovimiento.builder()
                .entidadTipo(entidadTipo)
                .entidadId(entidadId)
                .fechaHora(LocalDateTime.now())
                .usuarioSistema(SecurityUtils.getCurrentUsername())
                .tipoMovimiento(tipoMovimiento)
                .observacion(observacion)
                .build();
        historialRepository.save(historial);
    }

    @Transactional(readOnly = true)
    public List<HistorialMovimientoResponse> obtenerHistorial(TipoEntidad entidadTipo, Long entidadId) {
        return historialRepository.findByEntidadTipoAndEntidadIdOrderByFechaHoraDesc(entidadTipo, entidadId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}
