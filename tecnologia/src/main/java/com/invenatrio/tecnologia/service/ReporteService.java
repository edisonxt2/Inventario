package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.AsignacionEquipo;
import com.invenatrio.tecnologia.domain.entity.AsignacionMonitor;
import com.invenatrio.tecnologia.domain.entity.CentroCosto;
import com.invenatrio.tecnologia.domain.entity.ContratoRenting;
import com.invenatrio.tecnologia.domain.entity.Proveedor;
import com.invenatrio.tecnologia.domain.repository.AsignacionEquipoRepository;
import com.invenatrio.tecnologia.domain.repository.AsignacionMonitorRepository;
import com.invenatrio.tecnologia.domain.repository.CentroCostoRepository;
import com.invenatrio.tecnologia.domain.repository.ContratoRentingRepository;
import com.invenatrio.tecnologia.domain.repository.EquipoRepository;
import com.invenatrio.tecnologia.domain.repository.MonitorRepository;
import com.invenatrio.tecnologia.domain.repository.ProveedorRepository;
import com.invenatrio.tecnologia.dto.response.CostoCentroCostoResponse;
import com.invenatrio.tecnologia.dto.response.CostoProveedorResponse;
import com.invenatrio.tecnologia.dto.response.EquipoResponse;
import com.invenatrio.tecnologia.dto.response.MonitorResponse;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final EquipoRepository equipoRepository;
    private final MonitorRepository monitorRepository;
    private final ProveedorRepository proveedorRepository;
    private final ContratoRentingRepository contratoRepository;
    private final CentroCostoRepository centroCostoRepository;
    private final AsignacionEquipoRepository asignacionEquipoRepository;
    private final AsignacionMonitorRepository asignacionMonitorRepository;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public List<EquipoResponse> inventarioEquipos() {
        return equipoRepository.findOperativos().stream()
                .map(e -> mapper.toResponse(e, obtenerUsuarioEquipo(e.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> inventarioMonitores() {
        return monitorRepository.findOperativos().stream()
                .map(m -> mapper.toResponse(m, obtenerUsuarioMonitor(m.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> equiposPorProveedor(Long proveedorId) {
        return equipoRepository.findByProveedorId(proveedorId).stream()
                .map(e -> mapper.toResponse(e, obtenerUsuarioEquipo(e.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> monitoresPorProveedor(Long proveedorId) {
        return monitorRepository.findByProveedorId(proveedorId).stream()
                .map(m -> mapper.toResponse(m, obtenerUsuarioMonitor(m.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> equiposPorContrato(Long contratoId) {
        return equipoRepository.findByContratoId(contratoId).stream()
                .map(e -> mapper.toResponse(e, obtenerUsuarioEquipo(e.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> equiposPorCentroCosto(Long centroCostoId) {
        return asignacionEquipoRepository.findByActivaTrue().stream()
                .filter(a -> a.getUsuario().getCentroCosto().getId().equals(centroCostoId))
                .map(AsignacionEquipo::getEquipo)
                .map(e -> mapper.toResponse(e, obtenerUsuarioEquipo(e.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> equiposAsignados() {
        return asignacionEquipoRepository.findByActivaTrue().stream()
                .map(AsignacionEquipo::getEquipo)
                .map(e -> mapper.toResponse(e, obtenerUsuarioEquipo(e.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> monitoresAsignados() {
        return asignacionMonitorRepository.findByActivaTrue().stream()
                .map(AsignacionMonitor::getMonitor)
                .map(m -> mapper.toResponse(m, obtenerUsuarioMonitor(m.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> equiposDisponibles() {
        return equipoRepository.findDisponibles().stream()
                .map(e -> mapper.toResponse(e, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> monitoresDisponibles() {
        return monitorRepository.findDisponibles().stream()
                .map(m -> mapper.toResponse(m, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> equiposDevueltos() {
        return equipoRepository.findDevueltos().stream()
                .map(e -> mapper.toResponse(e, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> monitoresDevueltos() {
        return monitorRepository.findDevueltos().stream()
                .map(m -> mapper.toResponse(m, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CostoProveedorResponse> costosPorProveedor() {
        return proveedorRepository.findAll().stream()
                .map(p -> CostoProveedorResponse.builder()
                        .proveedorId(p.getId())
                        .proveedorNombre(p.getNombre())
                        .costoMensual(equipoRepository.sumValorMensualByProveedor(p.getId()))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CostoProveedorResponse> costosPorContrato(Long contratoId) {
        ContratoRenting contrato = contratoRepository.findById(contratoId).orElse(null);
        if (contrato == null) {
            return List.of();
        }
        BigDecimal total = equipoRepository.findByContratoId(contratoId).stream()
                .map(e -> e.getValorMensual())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return List.of(CostoProveedorResponse.builder()
                .proveedorId(contrato.getProveedor().getId())
                .proveedorNombre(contrato.getNumeroContrato())
                .costoMensual(total)
                .build());
    }

    @Transactional(readOnly = true)
    public List<CostoCentroCostoResponse> costosPorCentroCosto() {
        return centroCostoRepository.findAll().stream()
                .map(c -> CostoCentroCostoResponse.builder()
                        .centroCostoId(c.getId())
                        .centroCostoCodigo(c.getCodigo())
                        .centroCostoNombre(c.getNombre())
                        .costoMensual(equipoRepository.sumValorMensualByCentroCosto(c.getId()))
                        .build())
                .toList();
    }

    private com.invenatrio.tecnologia.domain.entity.Usuario obtenerUsuarioEquipo(Long equipoId) {
        return asignacionEquipoRepository.findByEquipoIdAndActivaTrue(equipoId)
                .map(AsignacionEquipo::getUsuario)
                .orElse(null);
    }

    private com.invenatrio.tecnologia.domain.entity.Usuario obtenerUsuarioMonitor(Long monitorId) {
        return asignacionMonitorRepository.findByMonitorIdAndActivaTrue(monitorId)
                .map(AsignacionMonitor::getUsuario)
                .orElse(null);
    }
}
