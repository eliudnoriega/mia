package com.mia.adminapi.controller;

import com.mia.adminapi.dto.MenuRequest;
import com.mia.adminapi.dto.MenuResponse;
import com.mia.adminapi.dto.UserProjectAccessResponse;
import com.mia.adminapi.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping({"/menus", "/api/menus"})
@Tag(name = "Menús & Control de Acceso", description = "Endpoints para identificar usuario autenticado, validar roles y consultar menús por proyecto")
@SecurityRequirement(name = "BearerAuth")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/projects/{projectId}/access")
    @Operation(
            summary = "Validar roles y obtener menús del proyecto para el usuario autenticado",
            description = "Identifica al usuario autenticado por JWT, valida sus roles en el sistema y retorna el árbol de menús según la asociación de sus roles con el projectId provisto."
    )
    public ResponseEntity<UserProjectAccessResponse> getMyProjectAccess(@PathVariable String projectId) {
        UserProjectAccessResponse response = menuService.getUserProjectAccess(projectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{username}/projects/{projectId}/access")
    @Operation(
            summary = "Consultar roles y menús de un usuario específico para un proyecto",
            description = "Valida los roles y menús asociados a un usuario específico y un proyecto determinado."
    )
    public ResponseEntity<UserProjectAccessResponse> getUserProjectAccess(
            @PathVariable String username,
            @PathVariable String projectId
    ) {
        UserProjectAccessResponse response = menuService.getUserProjectAccess(username, projectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects/{projectId}/tree")
    @Operation(
            summary = "Obtener catálogo completo de menús de un proyecto en árbol",
            description = "Retorna todos los menús configurados para un proyecto específico estructurados jerárquicamente."
    )
    public ResponseEntity<List<MenuResponse>> getProjectMenuTree(@PathVariable String projectId) {
        return ResponseEntity.ok(menuService.getMenuTreeByProject(projectId));
    }

    @GetMapping
    @Operation(summary = "Listar todos los menús", description = "Retorna todos los menús registrados en el sistema")
    public ResponseEntity<List<MenuResponse>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener menú por ID", description = "Retorna el detalle de un menú específico")
    public ResponseEntity<MenuResponse> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo menú", description = "Crea un nuevo menú con asignación opcional de roles, proyectos y empresas")
    public ResponseEntity<MenuResponse> createMenu(@Valid @RequestBody MenuRequest request) {
        MenuResponse created = menuService.createMenu(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar menú", description = "Modifica los atributos de un menú existente")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable Long id,
            @Valid @RequestBody MenuRequest request
    ) {
        return ResponseEntity.ok(menuService.updateMenu(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar menú", description = "Elimina un menú del sistema por su ID")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/associations")
    @Operation(summary = "Asociar roles y proyectos a un menú", description = "Actualiza la asignación de roles y proyectos a un menú existente")
    public ResponseEntity<MenuResponse> assignAssociations(
            @PathVariable Long id,
            @RequestParam(required = false) Set<String> roles,
            @RequestParam(required = false) Set<String> projectIds
    ) {
        return ResponseEntity.ok(menuService.assignRolesAndProjects(id, roles, projectIds));
    }
}
