package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg"
    );

    private final Path storagePath;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.storagePath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(storagePath);
        } catch (IOException e) {
            throw new BusinessException("No se pudo crear el directorio de almacenamiento");
        }
    }

    public String store(MultipartFile file, String prefix) {
        if (file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BusinessException("Tipo de archivo no permitido. Solo PDF e imágenes (JPEG, PNG)");
        }

        String extension = obtenerExtension(file.getOriginalFilename());
        String filename = prefix + "_" + UUID.randomUUID() + extension;
        Path target = storagePath.resolve(filename);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new BusinessException("Error al guardar el archivo");
        }
    }

    public Resource loadAsResource(String filename) {
        try {
            Path file = storagePath.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new BusinessException("Archivo no encontrado");
        } catch (MalformedURLException e) {
            throw new BusinessException("Archivo no encontrado");
        }
    }

    private String obtenerExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}
