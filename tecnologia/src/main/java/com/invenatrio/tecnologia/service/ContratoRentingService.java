package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.ContratoRenting;
import com.invenatrio.tecnologia.domain.entity.Proveedor;
import com.invenatrio.tecnologia.domain.repository.ContratoRentingRepository;
import com.invenatrio.tecnologia.dto.request.ContratoRentingRequest;
import com.invenatrio.tecnologia.dto.response.ContratoRentingResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoRentingService {

    private final ContratoRentingRepository contratoRepository;
    private final ProveedorService proveedorService;
    private final EntityMapper mapper;

    @Transactional
    public ContratoRentingResponse crear(ContratoRentingRequest request) {
        if (contratoRepository.existsByNumeroContrato(request.getNumeroContrato())) {
            throw new BusinessException("Ya existe un contrato con ese número");
        }
        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new BusinessException("La fecha fin debe ser posterior a la fecha inicio");
        }

        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        ContratoRenting contrato = ContratoRenting.builder()
                .numeroContrato(request.getNumeroContrato())
                .proveedor(proveedor)
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .build();

        return mapper.toResponse(contratoRepository.save(contrato));
    }

    @Transactional(readOnly = true)
    public List<ContratoRentingResponse> listar() {
        return contratoRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ContratoRentingResponse obtener(Long id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public ContratoRentingResponse actualizar(Long id, ContratoRentingRequest request) {
        ContratoRenting contrato = findById(id);
        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        contrato.setNumeroContrato(request.getNumeroContrato());
        contrato.setProveedor(proveedor);
        contrato.setFechaInicio(request.getFechaInicio());
        contrato.setFechaFin(request.getFechaFin());
        return mapper.toResponse(contratoRepository.save(contrato));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!contratoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contrato no encontrado");
        }
        contratoRepository.deleteById(id);
    }

    public ContratoRenting findById(Long id) {
        return contratoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato no encontrado"));
    }
}
