package com.mia.adminapi.controller;

import com.mia.adminapi.dto.ProjectResponse;
import com.mia.adminapi.dto.UpdateUserRequest;
import com.mia.adminapi.dto.UserDto;
import com.mia.adminapi.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping({"/users", "/api/users"})
@Tag(name = "Usuarios", description = "Endpoints para consultar usuarios y asignarles mÃºltiples roles y proyectos")
@SecurityRequirement(name = "BearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios", description = "Retorna todos los usuarios con sus roles y proyectos asignados")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Retorna los detalles completos de un usuario")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/roles")
    @Operation(summary = "Asignar mÃºltiples roles a un usuario", description = "Reemplaza los roles del usuario con el conjunto de nombres de roles provisto (ej. ['ROLE_ADMIN', 'ROLE_MANAGER'])")
    public ResponseEntity<UserDto> assignRoles(
            @PathVariable Long id,
            @RequestBody Set<String> roles
    ) {
        return ResponseEntity.ok(userService.assignRoles(id, roles));
    }

    @PutMapping("/{id}/projects")
    @Operation(summary = "Asignar mÃºltiples proyectos a un usuario", description = "Reemplaza los proyectos asignados al usuario con el conjunto de IDs provisto (ej. ['proj-1', 'proj-2'])")
    public ResponseEntity<UserDto> assignProjects(
            @PathVariable Long id,
            @RequestBody Set<String> projectIds
    ) {
        return ResponseEntity.ok(userService.assignProjects(id, projectIds));
    }

    @PostMapping("/{id}/projects/{projectId}")
    @Operation(summary = "Agregar un proyecto especÃ­fico al usuario", description = "Asocia un proyecto al usuario sin sobreescribir los existentes")
    public ResponseEntity<UserDto> addProjectToUser(
            @PathVariable Long id,
            @PathVariable String projectId
    ) {
        return ResponseEntity.ok(userService.addProjectToUser(id, projectId));
    }

    @DeleteMapping("/{id}/projects/{projectId}")
    @Operation(summary = "Desasociar un proyecto del usuario", description = "Elimina la asignaciÃ³n del proyecto para el usuario")
    public ResponseEntity<UserDto> removeProjectFromUser(
            @PathVariable Long id,
            @PathVariable String projectId
    ) {
        return ResponseEntity.ok(userService.removeProjectFromUser(id, projectId));
    }

    @GetMapping("/{id}/projects")
    @Operation(summary = "Consultar los proyectos asignados a un usuario", description = "Retorna la lista de proyectos a los que el usuario tiene acceso")
    public ResponseEntity<List<ProjectResponse>> getUserProjects(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProjects(id));
    }

    @PutMapping("/{id}/company/{companyId}")
    @Operation(summary = "Asignar empresa al usuario", description = "Asocia el usuario a una empresa especÃ­fica (un usuario pertenece Ãºnicamente a una empresa)")
    public ResponseEntity<UserDto> assignCompany(
            @PathVariable Long id,
            @PathVariable Long companyId
    ) {
        return ResponseEntity.ok(userService.assignCompany(id, companyId));
    }

    @DeleteMapping("/{id}/company")
    @Operation(summary = "Remover empresa del usuario", description = "Desasocia la empresa del usuario")
    public ResponseEntity<UserDto> removeCompany(@PathVariable Long id) {
        return ResponseEntity.ok(userService.assignCompany(id, null));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Modifica los datos del usuario (nombre, correo, empresa, roles)")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por su ID")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
