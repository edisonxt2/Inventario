package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.CentroCosto;
import com.invenatrio.tecnologia.domain.repository.CentroCostoRepository;
import com.invenatrio.tecnologia.dto.request.CentroCostoRequest;
import com.invenatrio.tecnologia.dto.response.CentroCostoResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CentroCostoService {

    private final CentroCostoRepository centroCostoRepository;
    private final EntityMapper mapper;

    @Transactional
    public CentroCostoResponse crear(CentroCostoRequest request) {
        if (centroCostoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe un centro de costo con ese código");
        }
        CentroCosto centro = CentroCosto.builder()
                .codigo(request.getCodigo())
                .nombre(request.getNombre())
                .build();
        return mapper.toResponse(centroCostoRepository.save(centro));
    }

    @Transactional(readOnly = true)
    public List<CentroCostoResponse> listar() {
        return centroCostoRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CentroCostoResponse obtener(Long id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public CentroCostoResponse actualizar(Long id, CentroCostoRequest request) {
        CentroCosto centro = findById(id);
        centro.setCodigo(request.getCodigo());
        centro.setNombre(request.getNombre());
        return mapper.toResponse(centroCostoRepository.save(centro));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!centroCostoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Centro de costo no encontrado");
        }
        centroCostoRepository.deleteById(id);
    }

    public CentroCosto findById(Long id) {
        return centroCostoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Centro de costo no encontrado"));
    }
}
