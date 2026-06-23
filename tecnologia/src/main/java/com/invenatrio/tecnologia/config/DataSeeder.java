package com.invenatrio.tecnologia.config;

import com.invenatrio.tecnologia.domain.entity.UsuarioSistema;
import com.invenatrio.tecnologia.domain.enums.RolSistema;
import com.invenatrio.tecnologia.domain.repository.UsuarioSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!usuarioSistemaRepository.existsByUsername("admin")) {
            usuarioSistemaRepository.save(UsuarioSistema.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .rol(RolSistema.ADMIN)
                    .activo(true)
                    .build());
        }

        if (!usuarioSistemaRepository.existsByUsername("editor")) {
            usuarioSistemaRepository.save(UsuarioSistema.builder()
                    .username("editor")
                    .password(passwordEncoder.encode("editor123"))
                    .rol(RolSistema.EDITOR)
                    .activo(true)
                    .build());
        }

        if (!usuarioSistemaRepository.existsByUsername("lector")) {
            usuarioSistemaRepository.save(UsuarioSistema.builder()
                    .username("lector")
                    .password(passwordEncoder.encode("lector123"))
                    .rol(RolSistema.LECTOR)
                    .activo(true)
                    .build());
        }
    }
}
