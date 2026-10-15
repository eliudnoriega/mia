package com.mia.adminapi.service;

import com.mia.adminapi.config.JwtService;
import com.mia.adminapi.dto.AuthRequest;
import com.mia.adminapi.dto.AuthResponse;
import com.mia.adminapi.dto.RegisterRequest;
import com.mia.adminapi.dto.UserDto;
import com.mia.adminapi.entity.Project;
import com.mia.adminapi.entity.Role;
import com.mia.adminapi.entity.User;
import com.mia.adminapi.repository.ProjectRepository;
import com.mia.adminapi.repository.RoleRepository;
import com.mia.adminapi.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProjectRepository projectRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario '" + request.getUsername() + "' ya está registrado.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El correo '" + request.getEmail() + "' ya está registrado.");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName()
        );
        user.setAvatarUrl("https://ui-avatars.com/api/?name=" + request.getFullName().replace(" ", "+") + "&background=2563eb&color=fff");

        // Asignar roles
        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                String formatted = roleName.toUpperCase().startsWith("ROLE_") ? roleName.toUpperCase() : "ROLE_" + roleName.toUpperCase();
                Role role = roleRepository.findByName(formatted)
                        .orElseGet(() -> roleRepository.save(new Role(formatted, "Rol asignado en registro")));
                roles.add(role);
            }
        } else {
            Role defaultRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_USER", "Rol estándar de usuario")));
            roles.add(defaultRole);
        }
        user.setRoles(roles);

        // Asignar proyectos opcionales en el registro
        if (request.getProjectIds() != null && !request.getProjectIds().isEmpty()) {
            List<Project> assignedProjects = projectRepository.findAllById(request.getProjectIds());
            user.setProjects(new HashSet<>(assignedProjects));
        }

        User savedUser = userRepository.save(user);

        Set<String> roleNames = savedUser.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        Set<String> projectIds = savedUser.getProjects().stream().map(Project::getId).collect(Collectors.toSet());

        String jwtToken = jwtService.generateToken(
                Map.of(
                        "roles", new ArrayList<>(roleNames),
                        "fullName", savedUser.getFullName(),
                        "userId", savedUser.getId()
                ),
                savedUser
        );

        return new AuthResponse(
                jwtToken,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                roleNames,
                projectIds,
                jwtService.getExpirationTime()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas."));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        request.getPassword()
                )
        );

        Set<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        Set<String> projectIds = user.getProjects().stream().map(Project::getId).collect(Collectors.toSet());

        String jwtToken = jwtService.generateToken(
                Map.of(
                        "roles", new ArrayList<>(roleNames),
                        "fullName", user.getFullName(),
                        "userId", user.getId()
                ),
                user
        );

        return new AuthResponse(
                jwtToken,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                roleNames,
                projectIds,
                jwtService.getExpirationTime()
        );
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + userDetails.getUsername()));
        return UserDto.fromEntity(user);
    }
}
