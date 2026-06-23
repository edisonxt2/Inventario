package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.CambioEstadoEquipoRequest;
import com.invenatrio.tecnologia.dto.request.EquipoRequest;
import com.invenatrio.tecnologia.dto.request.ReemplazoComponenteRequest;
import com.invenatrio.tecnologia.dto.response.EquipoResponse;
import com.invenatrio.tecnologia.dto.response.HistorialMovimientoResponse;
import com.invenatrio.tecnologia.domain.enums.TipoEntidad;
import com.invenatrio.tecnologia.service.EquipoService;
import com.invenatrio.tecnologia.service.HistorialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
public class EquipoController {

    private final EquipoService equipoService;
    private final HistorialService historialService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipoResponse crear(@Valid @RequestBody EquipoRequest request) {
        return equipoService.crear(request);
    }

    @GetMapping
    public List<EquipoResponse> listarOperativos() {
        return equipoService.listarOperativos();
    }

    @GetMapping("/{id}")
    public EquipoResponse obtener(@PathVariable Long id) {
        return equipoService.obtener(id);
    }

    @PutMapping("/{id}")
    public EquipoResponse actualizar(@PathVariable Long id, @Valid @RequestBody EquipoRequest request) {
        return equipoService.actualizar(id, request);
    }

    @PatchMapping("/{id}/estado")
    public EquipoResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstadoEquipoRequest request) {
        return equipoService.cambiarEstado(id, request);
    }

    @PostMapping("/{id}/componentes/reemplazo")
    public EquipoResponse reemplazarComponente(@PathVariable Long id, @Valid @RequestBody ReemplazoComponenteRequest request) {
        return equipoService.reemplazarComponente(id, request);
    }

    @GetMapping("/{id}/historial")
    public List<HistorialMovimientoResponse> historial(@PathVariable Long id) {
        return historialService.obtenerHistorial(TipoEntidad.EQUIPO, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        equipoService.eliminar(id);
    }
}
