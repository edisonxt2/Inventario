package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.Monitor;
import com.invenatrio.tecnologia.domain.entity.Proveedor;
import com.invenatrio.tecnologia.domain.entity.Usuario;
import com.invenatrio.tecnologia.domain.entity.AsignacionMonitor;
import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.domain.enums.TipoMovimiento;
import com.invenatrio.tecnologia.domain.repository.AsignacionMonitorRepository;
import com.invenatrio.tecnologia.domain.repository.MonitorRepository;
import com.invenatrio.tecnologia.dto.request.MonitorRequest;
import com.invenatrio.tecnologia.dto.response.MonitorResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final ProveedorService proveedorService;
    private final AsignacionMonitorRepository asignacionRepository;
    private final HistorialService historialService;
    private final EntityMapper mapper;

    @Transactional
    public MonitorResponse crear(MonitorRequest request) {
        validarUnicidad(request.getPlaca(), request.getSerial(), null, null);

        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        Monitor monitor = Monitor.builder()
                .placa(request.getPlaca())
                .serial(request.getSerial())
                .marca(request.getMarca())
                .modelo(request.getModelo())
                .estado(request.getEstado() != null ? request.getEstado() : EstadoMonitor.EN_BODEGA)
                .proveedor(proveedor)
                .build();

        Monitor saved = monitorRepository.save(monitor);
        historialService.registrar(TipoEntidad.MONITOR, saved.getId(), TipoMovimiento.CREACION, "Monitor creado");
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> listarOperativos() {
        return monitorRepository.findOperativos().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> listarDevueltos() {
        return monitorRepository.findDevueltos().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public MonitorResponse obtener(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public MonitorResponse actualizar(Long id, MonitorRequest request) {
        Monitor monitor = findById(id);
        if (monitor.getEstado() == EstadoMonitor.DEVUELTO_PROVEEDOR) {
            throw new BusinessException("No se puede modificar un monitor devuelto al proveedor");
        }

        validarUnicidad(request.getPlaca(), request.getSerial(), monitor.getPlaca(), monitor.getSerial());

        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        monitor.setPlaca(request.getPlaca());
        monitor.setSerial(request.getSerial());
        monitor.setMarca(request.getMarca());
        monitor.setModelo(request.getModelo());
        monitor.setProveedor(proveedor);

        if (request.getEstado() != null) {
            monitor.setEstado(request.getEstado());
        }

        Monitor saved = monitorRepository.save(monitor);
        historialService.registrar(TipoEntidad.MONITOR, saved.getId(), TipoMovimiento.MODIFICACION, "Monitor modificado");
        return toResponse(saved);
    }

    @Transactional
    public void eliminar(Long id) {
        Monitor monitor = findById(id);
        if (monitor.getEstado() == EstadoMonitor.ASIGNADO) {
            throw new BusinessException("No se puede eliminar un monitor asignado");
        }
        monitorRepository.delete(monitor);
    }

    public Monitor findById(Long id) {
        return monitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Monitor no encontrado"));
    }

    private void validarUnicidad(String placa, String serial, String placaActual, String serialActual) {
        if (placa != null && !placa.equals(placaActual) && monitorRepository.existsByPlaca(placa)) {
            throw new BusinessException("Ya existe un monitor con esa placa");
        }
        if (serial != null && !serial.equals(serialActual) && monitorRepository.existsBySerial(serial)) {
            throw new BusinessException("Ya existe un monitor con ese serial");
        }
    }

    private MonitorResponse toResponse(Monitor monitor) {
        Usuario asignado = asignacionRepository.findByMonitorIdAndActivaTrue(monitor.getId())
                .map(AsignacionMonitor::getUsuario)
                .orElse(null);
        return mapper.toResponse(monitor, asignado);
    }
}
