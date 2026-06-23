package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.UsuarioSistema;
import com.invenatrio.tecnologia.domain.repository.UsuarioSistemaRepository;
import com.invenatrio.tecnologia.dto.request.LoginRequest;
import com.invenatrio.tecnologia.dto.request.UsuarioSistemaRequest;
import com.invenatrio.tecnologia.dto.response.AuthResponse;
import com.invenatrio.tecnologia.dto.response.UsuarioSistemaResponse;
import com.invenatrio.tecnologia.exception.BusinessException;
import com.invenatrio.tecnologia.exception.ResourceNotFoundException;
import com.invenatrio.tecnologia.mapper.EntityMapper;
import com.invenatrio.tecnologia.security.CustomUserDetailsService;
import com.invenatrio.tecnologia.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityMapper mapper;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);
        UsuarioSistema usuario = usuarioSistemaRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return AuthResponse.builder()
                .token(token)
                .username(usuario.getUsername())
                .rol(usuario.getRol())
                .build();
    }

    @Transactional
    public UsuarioSistemaResponse crearUsuarioSistema(UsuarioSistemaRequest request) {
        if (usuarioSistemaRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("El username ya existe");
        }

        UsuarioSistema usuario = UsuarioSistema.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol())
                .activo(true)
                .build();

        return mapper.toResponse(usuarioSistemaRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public List<UsuarioSistemaResponse> listarUsuariosSistema() {
        return usuarioSistemaRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public void desactivarUsuarioSistema(Long id) {
        UsuarioSistema usuario = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario del sistema no encontrado"));
        usuario.setActivo(false);
        usuarioSistemaRepository.save(usuario);
    }
}
