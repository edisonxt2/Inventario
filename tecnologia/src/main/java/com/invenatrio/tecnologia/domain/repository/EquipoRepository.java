package com.invenatrio.tecnologia.domain.repository;

import com.invenatrio.tecnologia.domain.entity.Equipo;
import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    boolean existsByPlaca(String placa);
    boolean existsBySerial(String serial);
    List<Equipo> findByEstado(EstadoEquipo estado);
    List<Equipo> findByProveedorId(Long proveedorId);
    List<Equipo> findByContratoId(Long contratoId);

    @Query("SELECT e FROM Equipo e WHERE e.estado <> com.invenatrio.tecnologia.domain.enums.EstadoEquipo.DEVUELTO_PROVEEDOR")
    List<Equipo> findOperativos();

    @Query("SELECT e FROM Equipo e WHERE e.estado = com.invenatrio.tecnologia.domain.enums.EstadoEquipo.DEVUELTO_PROVEEDOR")
    List<Equipo> findDevueltos();

    @Query("SELECT e FROM Equipo e WHERE e.estado = com.invenatrio.tecnologia.domain.enums.EstadoEquipo.EN_BODEGA")
    List<Equipo> findDisponibles();

    @Query("SELECT COALESCE(SUM(e.valorMensual), 0) FROM Equipo e WHERE e.estado <> com.invenatrio.tecnologia.domain.enums.EstadoEquipo.DEVUELTO_PROVEEDOR")
    BigDecimal sumValorMensualOperativos();

    @Query("SELECT COALESCE(SUM(e.valorMensual), 0) FROM Equipo e WHERE e.estado <> com.invenatrio.tecnologia.domain.enums.EstadoEquipo.DEVUELTO_PROVEEDOR AND e.proveedor.id = :proveedorId")
    BigDecimal sumValorMensualByProveedor(Long proveedorId);

    @Query("SELECT COALESCE(SUM(e.valorMensual), 0) FROM Equipo e JOIN AsignacionEquipo a ON a.equipo = e AND a.activa = true WHERE e.estado <> com.invenatrio.tecnologia.domain.enums.EstadoEquipo.DEVUELTO_PROVEEDOR AND a.usuario.centroCosto.id = :centroCostoId")
    BigDecimal sumValorMensualByCentroCosto(Long centroCostoId);

    long countByEstado(EstadoEquipo estado);
}
