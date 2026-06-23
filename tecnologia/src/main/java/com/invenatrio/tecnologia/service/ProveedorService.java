package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.Proveedor;
import com.invenatrio.tecnologia.domain.repository.ProveedorRepository;
import com.invenatrio.tecnologia.dto.request.ProveedorRequest;
import com.invenatrio.tecnologia.dto.response.ProveedorResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final EntityMapper mapper;

    @Transactional
    public ProveedorResponse crear(ProveedorRequest request) {
        if (proveedorRepository.existsByNombre(request.getNombre())) {
            throw new BusinessException("Ya existe un proveedor con ese nombre");
        }
        Proveedor proveedor = Proveedor.builder().nombre(request.getNombre()).build();
        return mapper.toResponse(proveedorRepository.save(proveedor));
    }

    @Transactional(readOnly = true)
    public List<ProveedorResponse> listar() {
        return proveedorRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProveedorResponse obtener(Long id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public ProveedorResponse actualizar(Long id, ProveedorRequest request) {
        Proveedor proveedor = findById(id);
        proveedor.setNombre(request.getNombre());
        return mapper.toResponse(proveedorRepository.save(proveedor));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!proveedorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Proveedor no encontrado");
        }
        proveedorRepository.deleteById(id);
    }

    public Proveedor findById(Long id) {
        return proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));
    }
}
