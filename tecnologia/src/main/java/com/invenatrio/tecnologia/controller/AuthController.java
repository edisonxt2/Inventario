package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.request.LoginRequest;
import com.invenatrio.tecnologia.dto.request.UsuarioSistemaRequest;
import com.invenatrio.tecnologia.dto.response.AuthResponse;
import com.invenatrio.tecnologia.dto.response.UsuarioSistemaResponse;
import com.invenatrio.tecnologia.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/usuarios-sistema")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioSistemaResponse crearUsuarioSistema(@Valid @RequestBody UsuarioSistemaRequest request) {
        return authService.crearUsuarioSistema(request);
    }

    @GetMapping("/usuarios-sistema")
    public List<UsuarioSistemaResponse> listarUsuariosSistema() {
        return authService.listarUsuariosSistema();
    }

    @PatchMapping("/usuarios-sistema/{id}/desactivar")
  public void desactivarUsuarioSistema(@PathVariable Long id) {
        authService.desactivarUsuarioSistema(id);
    }
}
