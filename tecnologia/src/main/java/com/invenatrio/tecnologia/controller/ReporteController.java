package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.response.CostoCentroCostoResponse;
import com.invenatrio.tecnologia.dto.response.CostoProveedorResponse;
import com.invenatrio.tecnologia.dto.response.EquipoResponse;
import com.invenatrio.tecnologia.dto.response.MonitorResponse;
import com.invenatrio.tecnologia.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/inventario/equipos")
    public List<EquipoResponse> inventarioEquipos() {
        return reporteService.inventarioEquipos();
    }

    @GetMapping("/inventario/monitores")
    public List<MonitorResponse> inventarioMonitores() {
        return reporteService.inventarioMonitores();
    }

    @GetMapping("/equipos/por-proveedor/{proveedorId}")
    public List<EquipoResponse> equiposPorProveedor(@PathVariable Long proveedorId) {
        return reporteService.equiposPorProveedor(proveedorId);
    }

    @GetMapping("/monitores/por-proveedor/{proveedorId}")
    public List<MonitorResponse> monitoresPorProveedor(@PathVariable Long proveedorId) {
        return reporteService.monitoresPorProveedor(proveedorId);
    }

    @GetMapping("/equipos/por-contrato/{contratoId}")
    public List<EquipoResponse> equiposPorContrato(@PathVariable Long contratoId) {
        return reporteService.equiposPorContrato(contratoId);
    }

    @GetMapping("/equipos/por-centro-costo/{centroCostoId}")
    public List<EquipoResponse> equiposPorCentroCosto(@PathVariable Long centroCostoId) {
        return reporteService.equiposPorCentroCosto(centroCostoId);
    }

    @GetMapping("/equipos/asignados")
    public List<EquipoResponse> equiposAsignados() {
        return reporteService.equiposAsignados();
    }

    @GetMapping("/monitores/asignados")
    public List<MonitorResponse> monitoresAsignados() {
        return reporteService.monitoresAsignados();
    }

    @GetMapping("/equipos/disponibles")
    public List<EquipoResponse> equiposDisponibles() {
        return reporteService.equiposDisponibles();
    }

    @GetMapping("/monitores/disponibles")
    public List<MonitorResponse> monitoresDisponibles() {
        return reporteService.monitoresDisponibles();
    }

    @GetMapping("/activos/devueltos/equipos")
    public List<EquipoResponse> equiposDevueltos() {
        return reporteService.equiposDevueltos();
    }

    @GetMapping("/activos/devueltos/monitores")
    public List<MonitorResponse> monitoresDevueltos() {
        return reporteService.monitoresDevueltos();
    }

    @GetMapping("/costos/por-proveedor")
    public List<CostoProveedorResponse> costosPorProveedor() {
        return reporteService.costosPorProveedor();
    }

    @GetMapping("/costos/por-contrato/{contratoId}")
    public List<CostoProveedorResponse> costosPorContrato(@PathVariable Long contratoId) {
        return reporteService.costosPorContrato(contratoId);
    }

    @GetMapping("/costos/por-centro-costo")
    public List<CostoCentroCostoResponse> costosPorCentroCosto() {
        return reporteService.costosPorCentroCosto();
    }
}
