package com.mia.adminapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mia.adminapi.dto.AuthRequest;
import com.mia.adminapi.dto.AuthResponse;
import com.mia.adminapi.dto.RoleRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminApiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.mia.adminapi.service.MenuService menuService;

    @Autowired
    private com.mia.adminapi.repository.UserRepository userRepository;

    private String obtainAdminToken() throws Exception {
        return obtainToken("admin", "admin123");
    }

    private String obtainToken(String username, String password) throws Exception {
        AuthRequest loginRequest = new AuthRequest(username, password);
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponse.class);
        return authResponse.getToken();
    }

    @Test
    @DisplayName("Context loads and application starts successfully")
    void contextLoads() {
    }

    @Test
    @DisplayName("Debe fallar al acceder a /api/projects sin token JWT (403 o 401)")
    void shouldDenyAccessWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Debe autenticar usuario admin y permitir búsqueda de proyectos con token JWT")
    void shouldAuthenticateAndSearchProjectsWithJwt() throws Exception {
        String token = obtainAdminToken();

        // Consultar proyectos con el Bearer token
        mockMvc.perform(get("/api/projects")
                        .header("Authorization", "Bearer " + token)
                        .param("search", "MIA")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").isNumber())
                .andExpect(jsonPath("$.content[0].title").value("Portal Clientes MIA"));

        // Consultar métricas del dashboard con el Bearer token
        mockMvc.perform(get("/api/projects/dashboard/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProjects").value(26))
                .andExpect(jsonPath("$.activeProjects").isNumber());
    }

    @Test
    @DisplayName("Debe permitir crear un nuevo rol y listar los roles existentes")
    void shouldManageRoles() throws Exception {
        String token = obtainAdminToken();

        // 1. Listar roles iniciales
        mockMvc.perform(get("/api/roles")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 2. Crear nuevo rol
        RoleRequest roleReq = new RoleRequest("SUPERVISOR", "Rol de supervisión de operaciones");
        mockMvc.perform(post("/api/roles")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("ROLE_SUPERVISOR"))
                .andExpect(jsonPath("$.description").value("Rol de supervisión de operaciones"));
    }

    @Test
    @DisplayName("Debe permitir asignar múltiples roles y proyectos a un usuario")
    void shouldAssignRolesAndProjectsToUser() throws Exception {
        String token = obtainAdminToken();

        // Obtener ID del admin (1) o developer (2)
        MvcResult usersRes = mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();

        // Asignar múltiples roles al usuario 2 (developer)
        Set<String> rolesToAssign = Set.of("ROLE_DEVELOPER", "ROLE_USER", "ROLE_ADMIN");
        mockMvc.perform(put("/api/users/2/roles")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rolesToAssign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles").isArray())
                .andExpect(jsonPath("$.roles.length()").value(3));

        // Asignar múltiples proyectos al usuario 2
        Set<String> projectsToAssign = Set.of("proj-1", "proj-2", "proj-3");
        mockMvc.perform(put("/api/users/2/projects")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectsToAssign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectIds").isArray())
                .andExpect(jsonPath("$.projectIds.length()").value(3));

        // Consultar proyectos del usuario
        mockMvc.perform(get("/api/users/2/projects")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    @DisplayName("Debe permitir gestionar empresas y asociar un usuario a una empresa manteniendo múltiples proyectos")
    void shouldManageCompaniesAndAssignToUser() throws Exception {
        String token = obtainAdminToken();

        // 1. Listar empresas
        mockMvc.perform(get("/api/companies")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Seguros Universales S.A."));

        // 2. Crear nueva empresa
        com.mia.adminapi.dto.CompanyRequest compReq = new com.mia.adminapi.dto.CompanyRequest(
                "InsurTech Global Lab", "123987-4", "Edificio Avia, Nivel 10", "+502 2500-4400", "lab@insurtech.com", "https://insurtech.com", null
        );
        MvcResult createdCompRes = mockMvc.perform(post("/api/companies")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(compReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("InsurTech Global Lab"))
                .andReturn();

        com.mia.adminapi.dto.CompanyResponse createdComp = objectMapper.readValue(
                createdCompRes.getResponse().getContentAsString(),
                com.mia.adminapi.dto.CompanyResponse.class);

        // 3. Asociar empresa al usuario 2 (developer)
        mockMvc.perform(put("/api/users/2/company/" + createdComp.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company.id").value(createdComp.getId()))
                .andExpect(jsonPath("$.company.name").value("InsurTech Global Lab"))
                .andExpect(jsonPath("$.projectIds").isArray());
    }

    @Test
    @DisplayName("Debe validar el usuario autenticado (Admin), sus roles, empresa y menús asociados a un proyecto mediante /api/menus/projects/{id}/access")
    void shouldValidateAdminProjectMenusAndRolesViaEndpoint() throws Exception {
        String adminToken = obtainAdminToken();

        MvcResult result = mockMvc.perform(get("/api/menus/projects/proj-1/access")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.companyName").value("Seguros Universales S.A."))
                .andExpect(jsonPath("$.companyId").isNumber())
                .andExpect(jsonPath("$.company").isMap())
                .andExpect(jsonPath("$.projectId").value("proj-1"))
                .andExpect(jsonPath("$.hasProjectAccess").value(true))
                .andExpect(jsonPath("$.admin").value(true))
                .andExpect(jsonPath("$.userRoles").isArray())
                .andExpect(jsonPath("$.menus").isArray())
                .andExpect(jsonPath("$.totalMenus").isNumber())
                .andReturn();

        com.mia.adminapi.dto.UserProjectAccessResponse accessResponse = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                com.mia.adminapi.dto.UserProjectAccessResponse.class);

        assertThat(accessResponse.getUserRoles()).contains("ROLE_ADMIN", "ROLE_USER");
        assertThat(accessResponse.getCompanyName()).isEqualTo("Seguros Universales S.A.");
        assertThat(accessResponse.getTotalMenus()).isGreaterThan(0);
        assertThat(accessResponse.getMenus()).isNotEmpty();
    }

    @Test
    @DisplayName("Debe validar roles, empresa y menús de developer para proj-1 mediante /api/projects/{id}/menus")
    void shouldValidateDeveloperProjectMenusViaProjectEndpoint() throws Exception {
        String devToken = obtainToken("developer", "dev123");

        MvcResult result = mockMvc.perform(get("/api/projects/proj-1/menus")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("developer"))
                .andExpect(jsonPath("$.companyName").isNotEmpty())
                .andExpect(jsonPath("$.companyId").isNumber())
                .andExpect(jsonPath("$.projectId").value("proj-1"))
                .andExpect(jsonPath("$.hasProjectAccess").value(true))
                .andExpect(jsonPath("$.admin").value(false))
                .andExpect(jsonPath("$.userRoles").isArray())
                .andExpect(jsonPath("$.menus").isArray())
                .andReturn();

        com.mia.adminapi.dto.UserProjectAccessResponse accessResponse = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                com.mia.adminapi.dto.UserProjectAccessResponse.class);

        assertThat(accessResponse.getUserRoles()).contains("ROLE_DEVELOPER", "ROLE_USER");
        assertThat(accessResponse.getCompanyName()).isNotBlank();
        assertThat(accessResponse.getMenus()).isNotEmpty();
    }

    @Test
    @DisplayName("Debe reportar falta de acceso cuando el usuario no está asignado al proyecto (analyst en proj-1)")
    void shouldReportNoProjectAccessWhenUserNotAssigned() throws Exception {
        String analystToken = obtainToken("analyst", "analyst123");

        mockMvc.perform(get("/api/menus/projects/proj-1/access")
                        .header("Authorization", "Bearer " + analystToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("analyst"))
                .andExpect(jsonPath("$.companyName").value("Seguros Universales S.A."))
                .andExpect(jsonPath("$.hasProjectAccess").value(false))
                .andExpect(jsonPath("$.totalMenus").value(0))
                .andExpect(jsonPath("$.menus").isEmpty());
    }

    @Test
    @DisplayName("Debe ejecutar MenuService directamente y validar roles, empresa y menús por asociación con projectId")
    void shouldValidateDirectServiceCallForUserProjectMenus() {
        com.mia.adminapi.dto.UserProjectAccessResponse devAccess = menuService.getUserProjectAccess("developer", "proj-1");

        assertThat(devAccess).isNotNull();
        assertThat(devAccess.getUsername()).isEqualTo("developer");
        assertThat(devAccess.getCompanyName()).isNotBlank();
        assertThat(devAccess.getProjectId()).isEqualTo("proj-1");
        assertThat(devAccess.isHasProjectAccess()).isTrue();
        assertThat(devAccess.getUserRoles()).contains("ROLE_DEVELOPER");
        assertThat(devAccess.getTotalMenus()).isGreaterThan(0);
        assertThat(devAccess.getMenus()).isNotEmpty();

        // Validar chequeo de rol con usuario analyst (roles: ROLE_MANAGER, ROLE_USER en proj-2)
        com.mia.adminapi.entity.User analystUser = userRepository.findByUsername("analyst").orElseThrow();
        boolean hasManagerRole = menuService.validateUserHasRoleInProject(analystUser, "proj-2", "ROLE_MANAGER");
        assertThat(hasManagerRole).isTrue();

        boolean hasDevRole = menuService.validateUserHasRoleInProject(analystUser, "proj-2", "ROLE_DEVELOPER");
        assertThat(hasDevRole).isFalse();
    }

    @Test
    @DisplayName("Debe filtrar menús según la empresa del usuario: Seguros Universales ve menú exclusivo de Universales pero no de MIA Tech")
    void shouldFilterMenusAccordingToUserCompany() {
        // Admin pertenece a 'Seguros Universales S.A.'
        com.mia.adminapi.dto.UserProjectAccessResponse adminAccess = menuService.getUserProjectAccess("admin", "proj-1");
        List<String> adminMenuNames = adminAccess.getMenus().stream()
                .map(com.mia.adminapi.dto.MenuResponse::getName)
                .toList();

        // Debe ver el menú exclusivo de Seguros Universales ('portal-polizas')
        assertThat(adminMenuNames).contains("portal-polizas");
        // NO debe ver el menú exclusivo de MIA Digital Technologies ('portal-mia-lab')
        assertThat(adminMenuNames).doesNotContain("portal-mia-lab");
    }
}
