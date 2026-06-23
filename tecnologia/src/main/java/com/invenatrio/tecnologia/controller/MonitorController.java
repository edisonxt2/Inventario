package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.MonitorRequest;
import com.invenatrio.tecnologia.dto.response.HistorialMovimientoResponse;
import com.invenatrio.tecnologia.dto.response.MonitorResponse;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.service.HistorialService;
import com.invenatrio.tecnologia.service.MonitorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitores")
@RequiredArgsConstructor
public class MonitorController {

    private final MonitorService monitorService;
    private final HistorialService historialService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MonitorResponse crear(@Valid @RequestBody MonitorRequest request) {
        return monitorService.crear(request);
    }

    @GetMapping
    public List<MonitorResponse> listarOperativos() {
        return monitorService.listarOperativos();
    }

    @GetMapping("/{id}")
    public MonitorResponse obtener(@PathVariable Long id) {
        return monitorService.obtener(id);
    }

    @PutMapping("/{id}")
    public MonitorResponse actualizar(@PathVariable Long id, @Valid @RequestBody MonitorRequest request) {
        return monitorService.actualizar(id, request);
    }

    @GetMapping("/{id}/historial")
    public List<HistorialMovimientoResponse> historial(@PathVariable Long id) {
        return historialService.obtenerHistorial(TipoEntidad.MONITOR, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        monitorService.eliminar(id);
    }
}
