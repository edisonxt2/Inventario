package com.invenatrio.tecnologia.controller;

import com.invenatrio.tecnologia.dto.response.DashboardResponse;
import com.invenatrio.tecnologia.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse obtener() {
        return dashboardService.obtenerDashboard();
    }
}
