package com.invenatrio.tecnologia.service;

import com.invenatrio.tecnologia.domain.entity.CentroCosto;
import com.invenatrio.tecnologia.domain.entity.Proveedor;
import com.invenatrio.tecnologia.domain.enums.EstadoEquipo;
import com.invenatrio.tecnologia.domain.enums.EstadoMonitor;
import com.invenatrio.tecnologia.domain.repository.CentroCostoRepository;
import com.invenatrio.tecnologia.domain.repository.EquipoRepository;
import com.invenatrio.tecnologia.domain.repository.MonitorRepository;
import com.invenatrio.tecnologia.domain.repository.ProveedorRepository;
import com.invenatrio.tecnologia.dto.response.CostoCentroCostoResponse;
import com.invenatrio.tecnologia.dto.response.CostoProveedorResponse;
import com.invenatrio.tecnologia.dto.response.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EquipoRepository equipoRepository;
    private final MonitorRepository monitorRepository;
    private final ProveedorRepository proveedorRepository;
    private final CentroCostoRepository centroCostoRepository;

    @Transactional(readOnly = true)
    public DashboardResponse obtenerDashboard() {
        long totalEquipos = equipoRepository.count();
        long totalMonitores = monitorRepository.count();
        long equiposAsignados = equipoRepository.countByEstado(EstadoEquipo.ASIGNADO);
        long equiposEnBodega = equipoRepository.countByEstado(EstadoEquipo.EN_BODEGA);
        long monitoresAsignados = monitorRepository.countByEstado(EstadoMonitor.ASIGNADO);
        long monitoresEnBodega = monitorRepository.countByEstado(EstadoMonitor.EN_BODEGA);
        long equiposDevueltos = equipoRepository.countByEstado(EstadoEquipo.DEVUELTO_PROVEEDOR);
        long monitoresDevueltos = monitorRepository.countByEstado(EstadoMonitor.DEVUELTO_PROVEEDOR);

        BigDecimal costoMensualTotal = equipoRepository.sumValorMensualOperativos();

        List<CostoProveedorResponse> costoPorProveedor = proveedorRepository.findAll().stream()
                .map(this::calcularCostoProveedor)
                .toList();

        List<CostoCentroCostoResponse> costoPorCentroCosto = centroCostoRepository.findAll().stream()
                .map(this::calcularCostoCentroCosto)
                .toList();

        return DashboardResponse.builder()
                .totalEquipos(totalEquipos)
                .totalMonitores(totalMonitores)
                .equiposAsignados(equiposAsignados)
                .equiposEnBodega(equiposEnBodega)
                .monitoresAsignados(monitoresAsignados)
                .monitoresEnBodega(monitoresEnBodega)
                .equiposDevueltos(equiposDevueltos)
                .monitoresDevueltos(monitoresDevueltos)
                .costoMensualTotal(costoMensualTotal)
                .costoPorProveedor(costoPorProveedor)
                .costoPorCentroCosto(costoPorCentroCosto)
                .build();
    }

    private CostoProveedorResponse calcularCostoProveedor(Proveedor proveedor) {
        BigDecimal costo = equipoRepository.sumValorMensualByProveedor(proveedor.getId());
        return CostoProveedorResponse.builder()
                .proveedorId(proveedor.getId())
                .proveedorNombre(proveedor.getNombre())
                .costoMensual(costo)
                .build();
    }

    private CostoCentroCostoResponse calcularCostoCentroCosto(CentroCosto centro) {
        BigDecimal costo = equipoRepository.sumValorMensualByCentroCosto(centro.getId());
        return CostoCentroCostoResponse.builder()
                .centroCostoId(centro.getId())
                .centroCostoCodigo(centro.getCodigo())
                .centroCostoNombre(centro.getNombre())
                .costoMensual(costo)
                .build();
    }
}
