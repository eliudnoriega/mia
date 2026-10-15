package com.mia.adminapi.service;

import com.mia.adminapi.dto.CompanyResponse;
import com.mia.adminapi.dto.MenuRequest;
import com.mia.adminapi.dto.MenuResponse;
import com.mia.adminapi.dto.UserProjectAccessResponse;
import com.mia.adminapi.entity.Company;
import com.mia.adminapi.entity.Menu;
import com.mia.adminapi.entity.Project;
import com.mia.adminapi.entity.Role;
import com.mia.adminapi.entity.User;
import com.mia.adminapi.repository.CompanyRepository;
import com.mia.adminapi.repository.MenuRepository;
import com.mia.adminapi.repository.ProjectRepository;
import com.mia.adminapi.repository.RoleRepository;
import com.mia.adminapi.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuRepository menuRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;

    public MenuService(
            MenuRepository menuRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProjectRepository projectRepository,
            CompanyRepository companyRepository
    ) {
        this.menuRepository = menuRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.companyRepository = companyRepository;
    }

    /**
     * Identifica el usuario actualmente autenticado en el contexto de seguridad Spring Security.
     *
     * @return Entidad User del usuario autenticado.
     * @throws BadCredentialsException si no hay sesión activa o usuario autenticado.
     * @throws NoSuchElementException si el usuario no se encuentra en la base de datos.
     */
    @Transactional(readOnly = true)
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BadCredentialsException("No hay una sesión activa o el usuario no está autenticado.");
        }

        String username;
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else if (authentication.getPrincipal() instanceof String principalStr) {
            username = principalStr;
        } else {
            username = authentication.getName();
        }

        return userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new NoSuchElementException("Usuario autenticado '" + username + "' no encontrado en el sistema."));
    }

    /**
     * Obtiene y valida los roles y los menús correspondientes a un proyecto para el usuario actualmente autenticado.
     *
     * @param projectId Identificador del proyecto (ej. "proj-1").
     * @return DTO con la validación de acceso, roles del usuario y árbol jerárquico de menús permitidos.
     */
    @Transactional(readOnly = true)
    public UserProjectAccessResponse getUserProjectAccess(String projectId) {
        User user = getAuthenticatedUser();
        return getUserProjectAccess(user, projectId);
    }

    /**
     * Obtiene y valida los roles y menús de un proyecto para un nombre de usuario específico.
     *
     * @param usernameOrEmail Nombre de usuario o correo.
     * @param projectId Identificador del proyecto.
     * @return DTO con la validación de acceso, roles del usuario y árbol de menús permitidos.
     */
    @Transactional(readOnly = true)
    public UserProjectAccessResponse getUserProjectAccess(String usernameOrEmail, String projectId) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con: " + usernameOrEmail));
        return getUserProjectAccess(user, projectId);
    }

    /**
     * Valida los roles del usuario para el proyecto y recupera los menús según la asociación
     * entre sus roles y el projectId especificado.
     *
     * @param user Entidad del usuario a validar.
     * @param projectId Identificador del proyecto.
     * @return DTO detallado con la autorización y los menús asociados.
     */
    @Transactional(readOnly = true)
    public UserProjectAccessResponse getUserProjectAccess(User user, String projectId) {
        if (user == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo.");
        }
        if (projectId == null || projectId.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del proyecto no puede estar vacío.");
        }

        // Asegurar que el usuario esté asociado a la sesión de persistencia activa para colecciones perezosas
        User currentUser = user.getId() != null ? userRepository.findById(user.getId()).orElse(user) : user;

        // Empresa del usuario autenticado
        Company userCompany = currentUser.getCompany();
        Long companyId = userCompany != null ? userCompany.getId() : null;
        String companyName = userCompany != null ? userCompany.getName() : null;
        CompanyResponse companyResponse = userCompany != null ? CompanyResponse.fromEntity(userCompany) : null;

        // 1. Validar existencia del proyecto
        Project project = projectRepository.findById(projectId.trim())
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + projectId));

        // 2. Obtener y validar roles del usuario
        Set<Role> userRoles = currentUser.getRoles() != null ? currentUser.getRoles() : Collections.emptySet();
        Set<String> roleNames = userRoles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        boolean isAdmin = roleNames.contains("ROLE_ADMIN");

        // 3. Validar asignación del usuario al proyecto
        boolean isDirectlyAssigned = currentUser.getProjects() != null && currentUser.getProjects().stream()
                .anyMatch(p -> p.getId().equals(projectId));

        boolean hasProjectAccess = isAdmin || isDirectlyAssigned;

        // 4. Consultar los menús según la asociación entre el rol, el projectId y el company del usuario
        List<Menu> matchingMenus;
        if (!hasProjectAccess) {
            matchingMenus = Collections.emptyList();
        } else if (companyId != null) {
            if (isAdmin) {
                matchingMenus = menuRepository.findActiveMenusByProjectAndCompany(projectId, companyId);
            } else if (!userRoles.isEmpty()) {
                matchingMenus = menuRepository.findActiveMenusByProjectAndRolesAndCompany(projectId, userRoles, companyId);
            } else {
                matchingMenus = menuRepository.findActiveMenusByProjectWithNoRolesAndCompany(projectId, companyId);
            }
        } else {
            if (isAdmin) {
                matchingMenus = menuRepository.findActiveMenusByProject(projectId);
            } else if (!userRoles.isEmpty()) {
                matchingMenus = menuRepository.findActiveMenusByProjectAndRolesNoCompany(projectId, userRoles);
            } else {
                matchingMenus = menuRepository.findActiveMenusByProjectWithNoRoles(projectId);
            }
        }

        // 5. Construir jerarquía de menús (árbol padres e hijos ordenados)
        List<MenuResponse> menuTree = buildMenuHierarchy(matchingMenus);

        // 6. Mensaje descriptivo de validación
        String message;
        if (!hasProjectAccess) {
            message = "Acceso denegado: El usuario no tiene asignado el proyecto '" + project.getTitle() + "'.";
        } else if (matchingMenus.isEmpty()) {
            message = "Acceso concedido al proyecto, pero no hay menús configurados para los roles (" + roleNames + ") y la empresa (" + (companyName != null ? companyName : "Sin empresa asignada") + ") en este proyecto.";
        } else {
            message = "Acceso validado exitosamente. Se identificaron " + matchingMenus.size() + " menús correspondientes a los roles del usuario y su empresa (" + (companyName != null ? companyName : "Global") + ").";
        }

        return new UserProjectAccessResponse(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getFullName(),
                companyId,
                companyName,
                companyResponse,
                project.getId(),
                project.getTitle(),
                hasProjectAccess,
                isAdmin,
                roleNames,
                menuTree,
                matchingMenus.size(),
                message
        );
    }

    /**
     * Valida si el usuario autenticado tiene un rol específico dentro de un proyecto.
     *
     * @param projectId ID del proyecto.
     * @param requiredRole Nombre del rol requerido (ej. "ROLE_DEVELOPER").
     * @return true si tiene el rol y acceso al proyecto.
     */
    @Transactional(readOnly = true)
    public boolean validateUserHasRoleInProject(String projectId, String requiredRole) {
        User user = getAuthenticatedUser();
        return validateUserHasRoleInProject(user, projectId, requiredRole);
    }

    /**
     * Valida si un usuario específico posee un rol determinado y acceso a un proyecto.
     */
    @Transactional(readOnly = true)
    public boolean validateUserHasRoleInProject(String username, String projectId, String requiredRole) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con: " + username));
        return validateUserHasRoleInProject(user, projectId, requiredRole);
    }

    /**
     * Valida si un usuario específico posee un rol determinado y acceso a un proyecto.
     */
    @Transactional(readOnly = true)
    public boolean validateUserHasRoleInProject(User user, String projectId, String requiredRole) {
        if (user == null || projectId == null || requiredRole == null) {
            return false;
        }

        User currentUser = user.getId() != null ? userRepository.findById(user.getId()).orElse(user) : user;

        String formattedRole = requiredRole.toUpperCase().startsWith("ROLE_")
                ? requiredRole.toUpperCase()
                : "ROLE_" + requiredRole.toUpperCase();

        boolean hasRole = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase(formattedRole) || "ROLE_ADMIN".equalsIgnoreCase(r.getName()));

        boolean hasProject = currentUser.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getName()))
                || (currentUser.getProjects() != null && currentUser.getProjects().stream().anyMatch(p -> p.getId().equals(projectId)));

        return hasRole && hasProject;
    }

    /**
     * Retorna todos los menús registrados en el sistema.
     */
    @Transactional(readOnly = true)
    public List<MenuResponse> getAllMenus() {
        return menuRepository.findAll().stream()
                .map(MenuResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retorna todos los menús configurados para un proyecto específico en formato de árbol.
     */
    @Transactional(readOnly = true)
    public List<MenuResponse> getMenuTreeByProject(String projectId) {
        List<Menu> menus = menuRepository.findByProjectId(projectId);
        return buildMenuHierarchy(menus);
    }

    /**
     * Obtiene un menú por su ID.
     */
    @Transactional(readOnly = true)
    public MenuResponse getMenuById(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Menú no encontrado con ID: " + id));
        return MenuResponse.fromEntity(menu);
    }

    /**
     * Crea un nuevo menú y lo asocia a los roles, proyectos y empresas solicitados.
     */
    @Transactional
    public MenuResponse createMenu(MenuRequest request) {
        Menu menu = new Menu();
        copyMenuProperties(request, menu);
        Menu saved = menuRepository.save(menu);
        return MenuResponse.fromEntity(saved);
    }

    /**
     * Actualiza un menú existente.
     */
    @Transactional
    public MenuResponse updateMenu(Long id, MenuRequest request) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Menú no encontrado con ID: " + id));

        copyMenuProperties(request, menu);
        Menu updated = menuRepository.save(menu);
        return MenuResponse.fromEntity(updated);
    }

    /**
     * Elimina un menú por su ID.
     */
    @Transactional
    public void deleteMenu(Long id) {
        if (!menuRepository.existsById(id)) {
            throw new NoSuchElementException("Menú no encontrado con ID: " + id);
        }
        menuRepository.deleteById(id);
    }

    /**
     * Asocia roles y proyectos a un menú existente.
     */
    @Transactional
    public MenuResponse assignRolesAndProjects(Long menuId, Set<String> roleNames, Set<String> projectIds) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new NoSuchElementException("Menú no encontrado con ID: " + menuId));

        if (roleNames != null) {
            Set<Role> roles = new HashSet<>();
            for (String rName : roleNames) {
                String formatted = rName.toUpperCase().startsWith("ROLE_") ? rName.toUpperCase() : "ROLE_" + rName.toUpperCase();
                Role role = roleRepository.findByName(formatted)
                        .orElseThrow(() -> new NoSuchElementException("Rol no encontrado: " + formatted));
                roles.add(role);
            }
            menu.setRoles(roles);
        }

        if (projectIds != null) {
            List<Project> projects = projectRepository.findAllById(projectIds);
            menu.setProjects(new HashSet<>(projects));
        }

        Menu updated = menuRepository.save(menu);
        return MenuResponse.fromEntity(updated);
    }

    /**
     * Construye un árbol jerárquico (padres con hijos anidados) a partir de una lista plana de menús.
     */
    public List<MenuResponse> buildMenuHierarchy(List<Menu> menus) {
        if (menus == null || menus.isEmpty()) {
            return new ArrayList<>();
        }

        // 1. Conservar padres activos para que no queden menús hijos huérfanos
        Map<Long, Menu> entityMap = new LinkedHashMap<>();
        for (Menu m : menus) {
            entityMap.put(m.getId(), m);
            Menu p = m.getParent();
            while (p != null) {
                if (p.isActive() && !entityMap.containsKey(p.getId())) {
                    entityMap.put(p.getId(), p);
                }
                p = p.getParent();
            }
        }

        // 2. Mapear a DTOs
        Map<Long, MenuResponse> dtoMap = new LinkedHashMap<>();
        for (Menu m : entityMap.values()) {
            dtoMap.put(m.getId(), MenuResponse.fromEntity(m));
        }

        // 3. Vincular hijos a sus respectivos padres
        List<MenuResponse> rootMenus = new ArrayList<>();
        for (MenuResponse dto : dtoMap.values()) {
            Long parentId = dto.getParentId();
            if (parentId != null && dtoMap.containsKey(parentId)) {
                dtoMap.get(parentId).getChildren().add(dto);
            } else {
                rootMenus.add(dto);
            }
        }

        // 4. Ordenar recursivamente por orderIndex
        sortMenuResponses(rootMenus);
        return rootMenus;
    }

    private void sortMenuResponses(List<MenuResponse> list) {
        list.sort(Comparator.comparing(MenuResponse::getOrderIndex, Comparator.nullsLast(Comparator.naturalOrder())));
        for (MenuResponse item : list) {
            if (item.getChildren() != null && !item.getChildren().isEmpty()) {
                sortMenuResponses(item.getChildren());
            }
        }
    }

    private void copyMenuProperties(MenuRequest request, Menu menu) {
        menu.setName(request.getName());
        menu.setTitle(request.getTitle());
        menu.setPath(request.getPath());
        menu.setIcon(request.getIcon());
        menu.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);
        if (request.getActive() != null) {
            menu.setActive(request.getActive());
        }

        if (request.getParentId() != null) {
            Menu parent = menuRepository.findById(request.getParentId())
                    .orElseThrow(() -> new NoSuchElementException("Menú padre no encontrado con ID: " + request.getParentId()));
            menu.setParent(parent);
        } else {
            menu.setParent(null);
        }

        if (request.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String rName : request.getRoles()) {
                String formatted = rName.toUpperCase().startsWith("ROLE_") ? rName.toUpperCase() : "ROLE_" + rName.toUpperCase();
                Role role = roleRepository.findByName(formatted)
                        .orElseThrow(() -> new NoSuchElementException("Rol no encontrado: " + formatted));
                roles.add(role);
            }
            menu.setRoles(roles);
        }

        if (request.getProjectIds() != null) {
            List<Project> projects = projectRepository.findAllById(request.getProjectIds());
            menu.setProjects(new HashSet<>(projects));
        }

        if (request.getCompanyIds() != null) {
            List<Company> companies = companyRepository.findAllById(request.getCompanyIds());
            menu.setCompanies(new HashSet<>(companies));
        }
    }
}
