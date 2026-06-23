package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.ProveedorRequest;
import com.invenatrio.tecnologia.dto.response.ProveedorResponse;
import com.invenatrio.tecnologia.service.ProveedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
public class ProveedorController {

    private final ProveedorService proveedorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProveedorResponse crear(@Valid @RequestBody ProveedorRequest request) {
        return proveedorService.crear(request);
    }

    @GetMapping
    public List<ProveedorResponse> listar() {
        return proveedorService.listar();
    }

    @GetMapping("/{id}")
    public ProveedorResponse obtener(@PathVariable Long id) {
        return proveedorService.obtener(id);
    }

    @PutMapping("/{id}")
    public ProveedorResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProveedorRequest request) {
        return proveedorService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        proveedorService.eliminar(id);
    }
}
