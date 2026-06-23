package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.*;
import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.domain.enums.TipoMovimiento;
import com.invenatrio.tecnologia.domain.repository.AsignacionEquipoRepository;
import com.invenatrio.tecnologia.domain.repository.EquipoRepository;
import com.invenatrio.tecnologia.dto.request.CambioEstadoEquipoRequest;
import com.invenatrio.tecnologia.dto.request.ComponenteEquipoRequest;
import com.invenatrio.tecnologia.dto.request.EquipoRequest;
import com.invenatrio.tecnologia.dto.request.ReemplazoComponenteRequest;
import com.invenatrio.tecnologia.dto.response.EquipoResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final ProveedorService proveedorService;
    private final ContratoRentingService contratoService;
    private final AsignacionEquipoRepository asignacionRepository;
    private final HistorialService historialService;
    private final EntityMapper mapper;

    @Transactional
    public EquipoResponse crear(EquipoRequest request) {
        validarUnicidad(request.getPlaca(), request.getSerial(), null, null);

        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        ContratoRenting contrato = contratoService.findById(request.getContratoId());

        Equipo equipo = Equipo.builder()
                .placa(request.getPlaca())
                .serial(request.getSerial())
                .tipo(request.getTipo())
                .marca(request.getMarca())
                .modelo(request.getModelo())
                .procesador(request.getProcesador())
                .ram(request.getRam())
                .almacenamiento(request.getAlmacenamiento())
                .sistemaOperativo(request.getSistemaOperativo())
                .estado(request.getEstado() != null ? request.getEstado() : EstadoEquipo.EN_BODEGA)
                .fechaIngreso(request.getFechaIngreso())
                .valorMensual(request.getValorMensual())
                .observaciones(request.getObservaciones())
                .proveedor(proveedor)
                .contrato(contrato)
                .build();

        if (request.getComponentes() != null) {
            for (ComponenteEquipoRequest comp : request.getComponentes()) {
                equipo.getComponentes().add(buildComponente(equipo, comp));
            }
        }

        Equipo saved = equipoRepository.save(equipo);
        historialService.registrar(TipoEntidad.EQUIPO, saved.getId(), TipoMovimiento.CREACION, "Equipo creado");
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> listarOperativos() {
        return equipoRepository.findOperativos().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> listarDevueltos() {
        return equipoRepository.findDevueltos().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EquipoResponse obtener(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public EquipoResponse actualizar(Long id, EquipoRequest request) {
        Equipo equipo = findById(id);
        if (equipo.getEstado() == EstadoEquipo.DEVUELTO_PROVEEDOR) {
            throw new BusinessException("No se puede modificar un equipo devuelto al proveedor");
        }

        validarUnicidad(request.getPlaca(), request.getSerial(), equipo.getPlaca(), equipo.getSerial());

        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        ContratoRenting contrato = contratoService.findById(request.getContratoId());

        equipo.setPlaca(request.getPlaca());
        equipo.setSerial(request.getSerial());
        equipo.setTipo(request.getTipo());
        equipo.setMarca(request.getMarca());
        equipo.setModelo(request.getModelo());
        equipo.setProcesador(request.getProcesador());
        equipo.setRam(request.getRam());
        equipo.setAlmacenamiento(request.getAlmacenamiento());
        equipo.setSistemaOperativo(request.getSistemaOperativo());
        equipo.setFechaIngreso(request.getFechaIngreso());
        equipo.setValorMensual(request.getValorMensual());
        equipo.setObservaciones(request.getObservaciones());
        equipo.setProveedor(proveedor);
        equipo.setContrato(contrato);

        if (request.getEstado() != null && request.getEstado() != equipo.getEstado()) {
            equipo.setEstado(request.getEstado());
        }

        if (request.getComponentes() != null) {
            equipo.getComponentes().clear();
            for (ComponenteEquipoRequest comp : request.getComponentes()) {
                equipo.getComponentes().add(buildComponente(equipo, comp));
            }
        }

        Equipo saved = equipoRepository.save(equipo);
        historialService.registrar(TipoEntidad.EQUIPO, saved.getId(), TipoMovimiento.MODIFICACION, "Equipo modificado");
        return toResponse(saved);
    }

    @Transactional
    public EquipoResponse cambiarEstado(Long id, CambioEstadoEquipoRequest request) {
        Equipo equipo = findById(id);
        if (equipo.getEstado() == EstadoEquipo.DEVUELTO_PROVEEDOR) {
            throw new BusinessException("No se puede cambiar el estado de un equipo devuelto");
        }

        EstadoEquipo estadoAnterior = equipo.getEstado();
        equipo.setEstado(request.getEstado());
        Equipo saved = equipoRepository.save(equipo);

        historialService.registrar(
                TipoEntidad.EQUIPO,
                saved.getId(),
                TipoMovimiento.CAMBIO_ESTADO,
                "Estado cambiado de " + estadoAnterior + " a " + request.getEstado() +
                        (request.getObservacion() != null ? ". " + request.getObservacion() : "")
        );

        return toResponse(saved);
    }

    @Transactional
    public EquipoResponse reemplazarComponente(Long id, ReemplazoComponenteRequest request) {
        Equipo equipo = findById(id);
        if (equipo.getEstado() == EstadoEquipo.DEVUELTO_PROVEEDOR) {
            throw new BusinessException("No se puede modificar componentes de un equipo devuelto");
        }

        Optional<ComponenteEquipo> componenteOpt = equipo.getComponentes().stream()
                .filter(c -> c.getTipo() == request.getTipo())
                .findFirst();

        ComponenteEquipo componente = componenteOpt.orElseGet(() -> {
            ComponenteEquipo nuevo = ComponenteEquipo.builder()
                    .equipo(equipo)
                    .tipo(request.getTipo())
                    .build();
            equipo.getComponentes().add(nuevo);
            return nuevo;
        });

        componente.setSerial(request.getSerialNuevo());
        if (request.getObservacion() != null) {
            componente.setObservaciones(request.getObservacion());
        }

        Equipo saved = equipoRepository.save(equipo);
        historialService.registrar(
                TipoEntidad.EQUIPO,
                saved.getId(),
                TipoMovimiento.REEMPLAZO_PERIFERICO,
                "Reemplazo de " + request.getTipo() +
                        (request.getSerialAnterior() != null ? " (anterior: " + request.getSerialAnterior() + ")" : "") +
                        " por serial: " + request.getSerialNuevo() +
                        (request.getObservacion() != null ? ". " + request.getObservacion() : "")
        );

        return toResponse(saved);
    }

  @Transactional
    public void eliminar(Long id) {
        Equipo equipo = findById(id);
        if (equipo.getEstado() == EstadoEquipo.ASIGNADO) {
            throw new BusinessException("No se puede eliminar un equipo asignado");
        }
        equipoRepository.delete(equipo);
    }

    public Equipo findById(Long id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado"));
    }

    private void validarUnicidad(String placa, String serial, String placaActual, String serialActual) {
        if (placa != null && !placa.equals(placaActual) && equipoRepository.existsByPlaca(placa)) {
            throw new BusinessException("Ya existe un equipo con esa placa");
        }
        if (serial != null && !serial.equals(serialActual) && equipoRepository.existsBySerial(serial)) {
            throw new BusinessException("Ya existe un equipo con ese serial");
        }
    }

    private ComponenteEquipo buildComponente(Equipo equipo, ComponenteEquipoRequest request) {
        return ComponenteEquipo.builder()
                .equipo(equipo)
                .tipo(request.getTipo())
                .serial(request.getSerial())
                .observaciones(request.getObservaciones())
                .build();
    }

    private EquipoResponse toResponse(Equipo equipo) {
        Usuario asignado = asignacionRepository.findByEquipoIdAndActivaTrue(equipo.getId())
                .map(AsignacionEquipo::getUsuario)
                .orElse(null);
        return mapper.toResponse(equipo, asignado);
    }
}
