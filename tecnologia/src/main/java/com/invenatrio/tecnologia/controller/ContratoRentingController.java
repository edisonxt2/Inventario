package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.ContratoRentingRequest;
import com.invenatrio.tecnologia.dto.response.ContratoRentingResponse;
import com.invenatrio.tecnologia.service.ContratoRentingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contratos")
@RequiredArgsConstructor
public class ContratoRentingController {

    private final ContratoRentingService contratoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContratoRentingResponse crear(@Valid @RequestBody ContratoRentingRequest request) {
        return contratoService.crear(request);
    }

    @GetMapping
    public List<ContratoRentingResponse> listar() {
        return contratoService.listar();
    }

    @GetMapping("/{id}")
    public ContratoRentingResponse obtener(@PathVariable Long id) {
        return contratoService.obtener(id);
    }

    @PutMapping("/{id}")
    public ContratoRentingResponse actualizar(@PathVariable Long id, @Valid @RequestBody ContratoRentingRequest request) {
        return contratoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        contratoService.eliminar(id);
    }
}
