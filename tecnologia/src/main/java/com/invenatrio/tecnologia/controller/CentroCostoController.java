package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.CentroCostoRequest;
import com.invenatrio.tecnologia.dto.response.CentroCostoResponse;
import com.invenatrio.tecnologia.service.CentroCostoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centros-costo")
@RequiredArgsConstructor
public class CentroCostoController {

    private final CentroCostoService centroCostoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CentroCostoResponse crear(@Valid @RequestBody CentroCostoRequest request) {
        return centroCostoService.crear(request);
    }

    @GetMapping
    public List<CentroCostoResponse> listar() {
        return centroCostoService.listar();
    }

    @GetMapping("/{id}")
    public CentroCostoResponse obtener(@PathVariable Long id) {
        return centroCostoService.obtener(id);
    }

    @PutMapping("/{id}")
    public CentroCostoResponse actualizar(@PathVariable Long id, @Valid @RequestBody CentroCostoRequest request) {
        return centroCostoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        centroCostoService.eliminar(id);
    }
}
