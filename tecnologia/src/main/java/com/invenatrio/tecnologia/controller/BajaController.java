package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.domain.entity.DocumentoBaja;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.dto.request.BajaRequest;
import com.invenatrio.tecnologia.dto.response.DocumentoBajaResponse;
import com.invenatrio.tecnologia.dto.response.EquipoResponse;
import com.invenatrio.tecnologia.dto.response.MonitorResponse;
import com.invenatrio.tecnologia.service.BajaService;
import com.invenatrio.tecnologia.service.EquipoService;
import com.invenatrio.tecnologia.service.MonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bajas")
@RequiredArgsConstructor
public class BajaController {

    private final BajaService bajaService;
    private final EquipoService equipoService;
    private final MonitorService monitorService;

    @GetMapping("/equipos")
    public List<EquipoResponse> listarEquiposDevueltos() {
        return equipoService.listarDevueltos();
    }

    @GetMapping("/monitores")
    public List<MonitorResponse> listarMonitoresDevueltos() {
        return monitorService.listarDevueltos();
    }

    @PostMapping("/equipos/{equipoId}")
    public void registrarBajaEquipo(
            @PathVariable Long equipoId,
            @RequestPart(required = false) BajaRequest request,
            @RequestPart(required = false) MultipartFile archivo) {
        BajaRequest bajaRequest = request != null ? request : new BajaRequest();
        bajaService.registrarBajaEquipo(equipoId, bajaRequest, archivo);
    }

    @PostMapping("/monitores/{monitorId}")
    public void registrarBajaMonitor(
            @PathVariable Long monitorId,
            @RequestPart(required = false) BajaRequest request,
            @RequestPart(required = false) MultipartFile archivo) {
        BajaRequest bajaRequest = request != null ? request : new BajaRequest();
        bajaService.registrarBajaMonitor(monitorId, bajaRequest, archivo);
    }

    @GetMapping("/documentos/{tipo}/{entidadId}")
    public List<DocumentoBajaResponse> listarDocumentos(@PathVariable TipoEntidad tipo, @PathVariable Long entidadId) {
        return bajaService.listarDocumentos(tipo, entidadId);
    }

    @GetMapping("/documentos/download/{documentoId}")
    public ResponseEntity<Resource> descargarDocumento(@PathVariable Long documentoId) {
        DocumentoBaja documento = bajaService.obtenerDocumentoEntity(documentoId);
        Resource resource = bajaService.obtenerDocumento(documentoId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(documento.getTipoArchivo()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + documento.getNombreArchivo() + "\"")
                .body(resource);
    }
}
