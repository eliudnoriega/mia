package com.mia.adminapi.service;

import com.mia.adminapi.dto.ProjectResponse;
import com.mia.adminapi.dto.UpdateUserRequest;
import com.mia.adminapi.dto.UserDto;
import com.mia.adminapi.entity.Company;
import com.mia.adminapi.entity.Project;
import com.mia.adminapi.entity.Role;
import com.mia.adminapi.entity.User;
import com.mia.adminapi.repository.CompanyRepository;
import com.mia.adminapi.repository.ProjectRepository;
import com.mia.adminapi.repository.RoleRepository;
import com.mia.adminapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProjectRepository projectRepository,
            CompanyRepository companyRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto assignRoles(Long userId, Set<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        Set<Role> roles = new HashSet<>();
        for (String rName : roleNames) {
            String formatted = rName.toUpperCase().startsWith("ROLE_") ? rName.toUpperCase() : "ROLE_" + rName.toUpperCase();
            Role role = roleRepository.findByName(formatted)
                    .orElseThrow(() -> new NoSuchElementException("El rol '" + formatted + "' no existe. Cree el rol primero en /api/roles."));
            roles.add(role);
        }

        user.setRoles(roles);
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public UserDto assignProjects(Long userId, Set<String> projectIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        List<Project> projects = projectRepository.findAllById(projectIds);
        user.setProjects(new HashSet<>(projects));
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public UserDto addProjectToUser(Long userId, String projectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + projectId));

        user.addProject(project);
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public UserDto removeProjectFromUser(Long userId, String projectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + projectId));

        user.removeProject(project);
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        return user.getProjects().stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto assignCompany(Long userId, Long companyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        if (companyId != null) {
            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new NoSuchElementException("Empresa no encontrada con ID: " + companyId));
            user.setCompany(company);
        } else {
            user.setCompany(null);
        }

        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public UserDto updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String newEmail = request.getEmail().trim();
            if (!user.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("El correo '" + newEmail + "' ya está registrado en otra cuenta.");
            }
            user.setEmail(newEmail);
        }

        if (request.getCompanyId() != null) {
            if (request.getCompanyId() > 0) {
                Company company = companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new NoSuchElementException("Empresa no encontrada con ID: " + request.getCompanyId()));
                user.setCompany(company);
            } else {
                user.setCompany(null);
            }
        }

        if (request.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String rName : request.getRoles()) {
                String formatted = rName.toUpperCase().startsWith("ROLE_") ? rName.toUpperCase() : "ROLE_" + rName.toUpperCase();
                Role role = roleRepository.findByName(formatted)
                        .orElseThrow(() -> new NoSuchElementException("El rol '" + formatted + "' no existe."));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        if (request.getProjectIds() != null) {
            List<Project> projects = projectRepository.findAllById(request.getProjectIds());
            user.setProjects(new HashSet<>(projects));
        }

        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + userId));
        if ("admin".equalsIgnoreCase(user.getUsername())) {
            throw new IllegalArgumentException("El usuario maestro 'admin' no puede ser eliminado.");
        }
        userRepository.delete(user);
    }
}
