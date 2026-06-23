package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.*;
import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import com.invenatrio.tecnologia.domain.enums.EstadoUsuario;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.domain.enums.TipoMovimiento;
import com.invenatrio.tecnologia.domain.repository.AsignacionEquipoRepository;
import com.invenatrio.tecnologia.domain.repository.AsignacionMonitorRepository;
import com.invenatrio.tecnologia.dto.request.AsignacionRequest;
import com.invenatrio.tecnologia.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AsignacionService {

    private final EquipoService equipoService;
    private final MonitorService monitorService;
    private final UsuarioService usuarioService;
    private final AsignacionEquipoRepository asignacionEquipoRepository;
    private final AsignacionMonitorRepository asignacionMonitorRepository;
    private final HistorialService historialService;

    @Transactional
    public void asignarEquipo(AsignacionRequest request) {
        Equipo equipo = equipoService.findById(request.getActivoId());
        Usuario usuario = usuarioService.findById(request.getUsuarioId());

        validarUsuarioActivo(usuario);
        validarEquipoEnBodega(equipo);

        if (asignacionEquipoRepository.findByEquipoIdAndActivaTrue(equipo.getId()).isPresent()) {
            throw new BusinessException("El equipo ya tiene una asignación activa");
        }

        AsignacionEquipo asignacion = AsignacionEquipo.builder()
                .equipo(equipo)
                .usuario(usuario)
                .fechaAsignacion(LocalDateTime.now())
                .activa(true)
                .build();

        asignacionEquipoRepository.save(asignacion);
        equipo.setEstado(EstadoEquipo.ASIGNADO);

        historialService.registrar(
                TipoEntidad.EQUIPO,
                equipo.getId(),
                TipoMovimiento.ASIGNACION,
                "Asignado a " + usuario.getNombre() + (request.getObservacion() != null ? ". " + request.getObservacion() : "")
        );
    }

    @Transactional
    public void desasignarEquipo(Long equipoId, String observacion) {
        Equipo equipo = equipoService.findById(equipoId);
        AsignacionEquipo asignacion = asignacionEquipoRepository.findByEquipoIdAndActivaTrue(equipoId)
                .orElseThrow(() -> new BusinessException("El equipo no tiene asignación activa"));

        asignacion.setActiva(false);
        asignacion.setFechaDesasignacion(LocalDateTime.now());
        asignacionEquipoRepository.save(asignacion);

        if (equipo.getEstado() != EstadoEquipo.DEVUELTO_PROVEEDOR) {
            equipo.setEstado(EstadoEquipo.EN_BODEGA);
        }

        historialService.registrar(
                TipoEntidad.EQUIPO,
                equipo.getId(),
                TipoMovimiento.DESASIGNACION,
                observacion != null ? observacion : "Equipo desasignado"
        );
    }

    @Transactional
    public void cambiarUsuarioEquipo(Long equipoId, AsignacionRequest request) {
        Equipo equipo = equipoService.findById(equipoId);
        Usuario nuevoUsuario = usuarioService.findById(request.getUsuarioId());
        validarUsuarioActivo(nuevoUsuario);

        AsignacionEquipo asignacionActual = asignacionEquipoRepository.findByEquipoIdAndActivaTrue(equipoId)
                .orElseThrow(() -> new BusinessException("El equipo no tiene asignación activa"));

        Usuario usuarioAnterior = asignacionActual.getUsuario();
        asignacionActual.setActiva(false);
        asignacionActual.setFechaDesasignacion(LocalDateTime.now());
        asignacionEquipoRepository.save(asignacionActual);

        AsignacionEquipo nuevaAsignacion = AsignacionEquipo.builder()
                .equipo(equipo)
                .usuario(nuevoUsuario)
                .fechaAsignacion(LocalDateTime.now())
                .activa(true)
                .build();
        asignacionEquipoRepository.save(nuevaAsignacion);

        historialService.registrar(
                TipoEntidad.EQUIPO,
                equipo.getId(),
                TipoMovimiento.CAMBIO_USUARIO,
                "Cambio de " + usuarioAnterior.getNombre() + " a " + nuevoUsuario.getNombre() +
                        (request.getObservacion() != null ? ". " + request.getObservacion() : "")
        );
    }

    @Transactional
    public void asignarMonitor(AsignacionRequest request) {
        Monitor monitor = monitorService.findById(request.getActivoId());
        Usuario usuario = usuarioService.findById(request.getUsuarioId());

        validarUsuarioActivo(usuario);
        validarMonitorEnBodega(monitor);

        if (asignacionMonitorRepository.findByMonitorIdAndActivaTrue(monitor.getId()).isPresent()) {
            throw new BusinessException("El monitor ya tiene una asignación activa");
        }

        AsignacionMonitor asignacion = AsignacionMonitor.builder()
                .monitor(monitor)
                .usuario(usuario)
                .fechaAsignacion(LocalDateTime.now())
                .activa(true)
                .build();

        asignacionMonitorRepository.save(asignacion);
        monitor.setEstado(EstadoMonitor.ASIGNADO);

        historialService.registrar(
                TipoEntidad.MONITOR,
                monitor.getId(),
                TipoMovimiento.ASIGNACION,
                "Asignado a " + usuario.getNombre() + (request.getObservacion() != null ? ". " + request.getObservacion() : "")
        );
    }

    @Transactional
    public void desasignarMonitor(Long monitorId, String observacion) {
        Monitor monitor = monitorService.findById(monitorId);
        AsignacionMonitor asignacion = asignacionMonitorRepository.findByMonitorIdAndActivaTrue(monitorId)
                .orElseThrow(() -> new BusinessException("El monitor no tiene asignación activa"));

        asignacion.setActiva(false);
        asignacion.setFechaDesasignacion(LocalDateTime.now());
        asignacionMonitorRepository.save(asignacion);

        if (monitor.getEstado() != EstadoMonitor.DEVUELTO_PROVEEDOR) {
            monitor.setEstado(EstadoMonitor.EN_BODEGA);
        }

        historialService.registrar(
                TipoEntidad.MONITOR,
                monitor.getId(),
                TipoMovimiento.DESASIGNACION,
                observacion != null ? observacion : "Monitor desasignado"
        );
    }

    @Transactional
    public void cambiarUsuarioMonitor(Long monitorId, AsignacionRequest request) {
        Monitor monitor = monitorService.findById(monitorId);
        Usuario nuevoUsuario = usuarioService.findById(request.getUsuarioId());
        validarUsuarioActivo(nuevoUsuario);

        AsignacionMonitor asignacionActual = asignacionMonitorRepository.findByMonitorIdAndActivaTrue(monitorId)
                .orElseThrow(() -> new BusinessException("El monitor no tiene asignación activa"));

        Usuario usuarioAnterior = asignacionActual.getUsuario();
        asignacionActual.setActiva(false);
        asignacionActual.setFechaDesasignacion(LocalDateTime.now());
        asignacionMonitorRepository.save(asignacionActual);

        AsignacionMonitor nuevaAsignacion = AsignacionMonitor.builder()
                .monitor(monitor)
                .usuario(nuevoUsuario)
                .fechaAsignacion(LocalDateTime.now())
                .activa(true)
                .build();
        asignacionMonitorRepository.save(nuevaAsignacion);

        historialService.registrar(
                TipoEntidad.MONITOR,
                monitor.getId(),
                TipoMovimiento.CAMBIO_USUARIO,
                "Cambio de " + usuarioAnterior.getNombre() + " a " + nuevoUsuario.getNombre() +
                        (request.getObservacion() != null ? ". " + request.getObservacion() : "")
        );
    }

    private void validarUsuarioActivo(Usuario usuario) {
        if (usuario.getEstado() == EstadoUsuario.RETIRADO) {
            throw new BusinessException("No se pueden asignar activos a usuarios retirados");
        }
    }

    private void validarEquipoEnBodega(Equipo equipo) {
        if (equipo.getEstado() != EstadoEquipo.EN_BODEGA) {
            throw new BusinessException("Solo se pueden asignar equipos con estado EN_BODEGA");
        }
    }

    private void validarMonitorEnBodega(Monitor monitor) {
        if (monitor.getEstado() != EstadoMonitor.EN_BODEGA) {
            throw new BusinessException("Solo se pueden asignar monitores con estado EN_BODEGA");
        }
    }
}
