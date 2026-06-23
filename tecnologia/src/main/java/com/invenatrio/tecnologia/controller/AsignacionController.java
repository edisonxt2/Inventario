package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.AsignacionRequest;
import com.invenatrio.tecnologia.service.AsignacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asignaciones")
@RequiredArgsConstructor
public class AsignacionController {

    private final AsignacionService asignacionService;

    @PostMapping("/equipos")
    @ResponseStatus(HttpStatus.CREATED)
    public void asignarEquipo(@Valid @RequestBody AsignacionRequest request) {
        asignacionService.asignarEquipo(request);
    }

    @PostMapping("/equipos/{equipoId}/desasignar")
    public void desasignarEquipo(@PathVariable Long equipoId, @RequestParam(required = false) String observacion) {
        asignacionService.desasignarEquipo(equipoId, observacion);
    }

    @PostMapping("/equipos/{equipoId}/cambiar-usuario")
    public void cambiarUsuarioEquipo(@PathVariable Long equipoId, @Valid @RequestBody AsignacionRequest request) {
        asignacionService.cambiarUsuarioEquipo(equipoId, request);
    }

    @PostMapping("/monitores")
    @ResponseStatus(HttpStatus.CREATED)
    public void asignarMonitor(@Valid @RequestBody AsignacionRequest request) {
        asignacionService.asignarMonitor(request);
    }

    @PostMapping("/monitores/{monitorId}/desasignar")
    public void desasignarMonitor(@PathVariable Long monitorId, @RequestParam(required = false) String observacion) {
        asignacionService.desasignarMonitor(monitorId, observacion);
    }

    @PostMapping("/monitores/{monitorId}/cambiar-usuario")
    public void cambiarUsuarioMonitor(@PathVariable Long monitorId, @Valid @RequestBody AsignacionRequest request) {
        asignacionService.cambiarUsuarioMonitor(monitorId, request);
    }
}
