package com.mia.adminapi.service;

import com.mia.adminapi.dto.RoleRequest;
import com.mia.adminapi.dto.RoleResponse;
import com.mia.adminapi.entity.Role;
import com.mia.adminapi.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(RoleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Rol no encontrado con ID: " + id));
        return RoleResponse.fromEntity(role);
    }

    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        String roleName = formatRoleName(request.getName());

        if (roleRepository.existsByName(roleName)) {
            throw new IllegalArgumentException("El rol '" + roleName + "' ya existe.");
        }

        Role role = new Role(roleName, request.getDescription());
        Role saved = roleRepository.save(role);
        return RoleResponse.fromEntity(saved);
    }

    @Transactional
    public RoleResponse updateRole(Long id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Rol no encontrado con ID: " + id));

        String newRoleName = formatRoleName(request.getName());

        if (!role.getName().equalsIgnoreCase(newRoleName) && roleRepository.existsByName(newRoleName)) {
            throw new IllegalArgumentException("Ya existe otro rol con el nombre '" + newRoleName + "'.");
        }

        role.setName(newRoleName);
        role.setDescription(request.getDescription());
        Role updated = roleRepository.save(role);
        return RoleResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Rol no encontrado con ID: " + id));
        roleRepository.delete(role);
    }

    private String formatRoleName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del rol no puede estar vacío");
        }
        String clean = name.trim().toUpperCase();
        if (!clean.startsWith("ROLE_")) {
            clean = "ROLE_" + clean;
        }
        return clean;
    }
}
