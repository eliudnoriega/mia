package com.mia.adminapi.controller;

import com.mia.adminapi.dto.DashboardStatsResponse;
import com.mia.adminapi.dto.PagedResponse;
import com.mia.adminapi.dto.ProjectRequest;
import com.mia.adminapi.dto.ProjectResponse;
import com.mia.adminapi.dto.UserProjectAccessResponse;
import com.mia.adminapi.service.MenuService;
import com.mia.adminapi.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/projects", "/api/projects"})
@Tag(name = "Proyectos & Dashboard", description = "Endpoints para buscar, filtrar y administrar proyectos en el dashboard")
@SecurityRequirement(name = "BearerAuth")
public class ProjectController {

    private final ProjectService projectService;
    private final MenuService menuService;

    public ProjectController(ProjectService projectService, MenuService menuService) {
        this.projectService = projectService;
        this.menuService = menuService;
    }

    @GetMapping
    @Operation(summary = "Buscar y listar proyectos para el Dashboard",
            description = "Permite buscar por texto libre y filtrar por categoría, ambiente, estado y favoritos con paginación.")
    public ResponseEntity<PagedResponse<ProjectResponse>> searchProjects(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "todos") String category,
            @RequestParam(required = false, defaultValue = "ALL") String environment,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "false") Boolean onlyFavorites,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "8") int size,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir
    ) {
        PagedResponse<ProjectResponse> response = projectService.searchProjects(
                search, category, environment, status, onlyFavorites, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener proyecto por ID", description = "Retorna la información detallada de un proyecto")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable String id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo proyecto", description = "Registra un nuevo proyecto en la base de datos")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse created = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proyecto existente", description = "Modifica los datos de un proyecto específico")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable String id,
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/favorite")
    @Operation(summary = "Alternar estado favorito", description = "Marca o desmarca un proyecto como favorito")
    public ResponseEntity<ProjectResponse> toggleFavorite(@PathVariable String id) {
        ProjectResponse updated = projectService.toggleFavorite(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar proyecto", description = "Elimina un proyecto de la base de datos")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Estadísticas generales para el Dashboard",
            description = "Devuelve métricas como total de proyectos, activos, mantenimiento, métricas por categoría y top proyectos.")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = projectService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping({"/{id}/menus", "/{id}/my-access"})
    @Operation(
            summary = "Obtener menús del proyecto para el usuario autenticado",
            description = "Identifica al usuario autenticado, valida sus roles en el sistema y retorna el árbol de menús según la asociación de sus roles con el proyecto."
    )
    public ResponseEntity<UserProjectAccessResponse> getProjectMenusForCurrentUser(@PathVariable String id) {
        UserProjectAccessResponse response = menuService.getUserProjectAccess(id);
        return ResponseEntity.ok(response);
    }
}
