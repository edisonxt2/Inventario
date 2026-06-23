package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByDocumento(String documento);
    boolean existsByCorreo(String correo);
}
