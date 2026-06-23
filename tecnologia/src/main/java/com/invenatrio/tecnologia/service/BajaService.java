package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.DocumentoBaja;
import com.invenatrio.tecnologia.domain.entity.Equipo;
import com.invenatrio.tecnologia.domain.entity.Monitor;
import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.domain.enums.TipoMovimiento;
import com.invenatrio.tecnologia.domain.repository.DocumentoBajaRepository;
import com.invenatrio.tecnologia.dto.request.BajaRequest;
import com.invenatrio.tecnologia.dto.response.DocumentoBajaResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BajaService {

    private final EquipoService equipoService;
    private final MonitorService monitorService;
    private final AsignacionService asignacionService;
    private final HistorialService historialService;
    private final DocumentoBajaRepository documentoBajaRepository;
    private final FileStorageService fileStorageService;
    private final EntityMapper mapper;

    @Transactional
    public void registrarBajaEquipo(Long equipoId, BajaRequest request, MultipartFile archivo) {
        Equipo equipo = equipoService.findById(equipoId);

        if (equipo.getEstado() == EstadoEquipo.DEVUELTO_PROVEEDOR) {
            throw new BusinessException("El equipo ya fue devuelto al proveedor");
        }

        if (equipo.getEstado() == EstadoEquipo.ASIGNADO) {
            asignacionService.desasignarEquipo(equipoId, "Desasignación automática por baja");
        }

        equipo.setEstado(EstadoEquipo.DEVUELTO_PROVEEDOR);

        if (archivo != null && !archivo.isEmpty()) {
            guardarDocumento(TipoEntidad.EQUIPO, equipoId, archivo);
        }

        historialService.registrar(
                TipoEntidad.EQUIPO,
                equipoId,
                TipoMovimiento.BAJA,
                request.getObservacion() != null ? request.getObservacion() : "Equipo devuelto al proveedor"
        );
    }

    @Transactional
    public void registrarBajaMonitor(Long monitorId, BajaRequest request, MultipartFile archivo) {
        Monitor monitor = monitorService.findById(monitorId);

        if (monitor.getEstado() == EstadoMonitor.DEVUELTO_PROVEEDOR) {
            throw new BusinessException("El monitor ya fue devuelto al proveedor");
        }

        if (monitor.getEstado() == EstadoMonitor.ASIGNADO) {
            asignacionService.desasignarMonitor(monitorId, "Desasignación automática por baja");
        }

        monitor.setEstado(EstadoMonitor.DEVUELTO_PROVEEDOR);

        if (archivo != null && !archivo.isEmpty()) {
            guardarDocumento(TipoEntidad.MONITOR, monitorId, archivo);
        }

        historialService.registrar(
                TipoEntidad.MONITOR,
                monitorId,
                TipoMovimiento.BAJA,
                request.getObservacion() != null ? request.getObservacion() : "Monitor devuelto al proveedor"
        );
    }

    @Transactional(readOnly = true)
    public List<DocumentoBajaResponse> listarDocumentos(TipoEntidad tipo, Long entidadId) {
        return documentoBajaRepository.findByEntidadTipoAndEntidadId(tipo, entidadId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Resource obtenerDocumento(Long documentoId) {
        DocumentoBaja documento = documentoBajaRepository.findById(documentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));
        return fileStorageService.loadAsResource(documento.getRuta());
    }

    @Transactional(readOnly = true)
    public DocumentoBaja obtenerDocumentoEntity(Long documentoId) {
        return documentoBajaRepository.findById(documentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));
    }

    private void guardarDocumento(TipoEntidad tipo, Long entidadId, MultipartFile archivo) {
        String ruta = fileStorageService.store(archivo, tipo.name() + "_" + entidadId);

        DocumentoBaja documento = DocumentoBaja.builder()
                .entidadTipo(tipo)
                .entidadId(entidadId)
                .nombreArchivo(archivo.getOriginalFilename())
                .tipoArchivo(archivo.getContentType())
                .ruta(ruta)
                .fechaSubida(LocalDateTime.now())
                .build();

        documentoBajaRepository.save(documento);
    }
}
