package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.CentroCosto;
import com.invenatrio.tecnologia.domain.entity.Usuario;
import com.invenatrio.tecnologia.domain.repository.UsuarioRepository;
import com.invenatrio.tecnologia.dto.request.UsuarioRequest;
import com.invenatrio.tecnologia.dto.response.UsuarioResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CentroCostoService centroCostoService;
    private final EntityMapper mapper;

    @Transactional
    public UsuarioResponse crear(UsuarioRequest request) {
        if (usuarioRepository.existsByDocumento(request.getDocumento())) {
            throw new BusinessException("Ya existe un usuario con ese documento");
        }
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new BusinessException("Ya existe un usuario con ese correo");
        }

        CentroCosto centroCosto = centroCostoService.findById(request.getCentroCostoId());
        Usuario usuario = Usuario.builder()
                .documento(request.getDocumento())
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .centroCosto(centroCosto)
                .estado(request.getEstado())
                .build();

        return mapper.toResponse(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return mapper.toResponse(findById(id));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
        Usuario usuario = findById(id);
        CentroCosto centroCosto = centroCostoService.findById(request.getCentroCostoId());
        usuario.setDocumento(request.getDocumento());
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setCentroCosto(centroCosto);
        usuario.setEstado(request.getEstado());
        return mapper.toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
