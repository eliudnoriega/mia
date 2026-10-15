package com.mia.adminapi.service;

import com.mia.adminapi.dto.DashboardStatsResponse;
import com.mia.adminapi.dto.PagedResponse;
import com.mia.adminapi.dto.ProjectRequest;
import com.mia.adminapi.dto.ProjectResponse;
import com.mia.adminapi.entity.Project;
import com.mia.adminapi.repository.ProjectRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> searchProjects(
            String search,
            String category,
            String environment,
            String status,
            Boolean onlyFavorites,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort;
        if ("popular".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "accessCount");
        } else if ("recent".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            sort = "desc".equalsIgnoreCase(sortDir)
                    ? Sort.by(Sort.Direction.DESC, "title")
                    : Sort.by(Sort.Direction.ASC, "title");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Project> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Búsqueda por término
            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                Predicate titlePred = cb.like(cb.lower(root.get("title")), term);
                Predicate subPred = cb.like(cb.lower(root.get("subtitle")), term);
                Predicate descPred = cb.like(cb.lower(root.get("description")), term);
                Predicate catLabelPred = cb.like(cb.lower(root.get("categoryLabel")), term);
                Predicate teamPred = cb.like(cb.lower(root.get("team")), term);
                predicates.add(cb.or(titlePred, subPred, descPred, catLabelPred, teamPred));
            }

            // Filtro por categoría
            if (category != null && !category.trim().isEmpty() && !"todos".equalsIgnoreCase(category)) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }

            // Filtro por entorno
            if (environment != null && !environment.trim().isEmpty() && !"ALL".equalsIgnoreCase(environment)) {
                predicates.add(cb.equal(root.get("environment"), environment.trim().toUpperCase()));
            }

            // Filtro por estado
            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }

            // Filtro por favoritos
            if (Boolean.TRUE.equals(onlyFavorites)) {
                predicates.add(cb.isTrue(root.get("isFavorite")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Project> projectPage = projectRepository.findAll(spec, pageable);
        List<ProjectResponse> content = projectPage.getContent().stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                projectPage.getNumber(),
                projectPage.getSize(),
                projectPage.getTotalElements(),
                projectPage.getTotalPages(),
                projectPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + id));
        return ProjectResponse.fromEntity(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        String id = "proj-" + System.currentTimeMillis();
        Project project = new Project();
        project.setId(id);
        copyProperties(request, project);

        Project saved = projectRepository.save(project);
        return ProjectResponse.fromEntity(saved);
    }

    @Transactional
    public ProjectResponse updateProject(String id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + id));

        copyProperties(request, project);
        Project updated = projectRepository.save(project);
        return ProjectResponse.fromEntity(updated);
    }

    @Transactional
    public ProjectResponse toggleFavorite(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + id));

        project.setFavorite(!project.isFavorite());
        Project updated = projectRepository.save(project);
        return ProjectResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new NoSuchElementException("Proyecto no encontrado con ID: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalProjects(projectRepository.count());
        stats.setActiveProjects(projectRepository.countByStatus("active"));
        stats.setMaintenanceProjects(projectRepository.countByStatus("maintenance"));
        stats.setOfflineProjects(projectRepository.countByStatus("offline"));
        stats.setFavoritesCount(projectRepository.countByIsFavorite(true));

        // Conteo por categoría
        Map<String, Long> byCat = new LinkedHashMap<>();
        for (Object[] row : projectRepository.countProjectsGroupedByCategory()) {
            if (row[0] != null && row[1] != null) {
                byCat.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        stats.setProjectsByCategory(byCat);

        // Conteo por entorno
        Map<String, Long> byEnv = new LinkedHashMap<>();
        for (Object[] row : projectRepository.countProjectsGroupedByEnvironment()) {
            if (row[0] != null && row[1] != null) {
                byEnv.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        stats.setProjectsByEnvironment(byEnv);

        // Top más accedidos
        stats.setTopProjects(
                projectRepository.findTop5ByOrderByAccessCountDesc().stream()
                        .map(ProjectResponse::fromEntity)
                        .collect(Collectors.toList())
        );

        // Recientes
        stats.setRecentProjects(
                projectRepository.findTop5ByOrderByCreatedAtDesc().stream()
                        .map(ProjectResponse::fromEntity)
                        .collect(Collectors.toList())
        );

        return stats;
    }

    private void copyProperties(ProjectRequest request, Project project) {
        project.setTitle(request.getTitle());
        project.setSubtitle(request.getSubtitle());
        project.setDescription(request.getDescription());
        project.setCategory(request.getCategory());
        project.setCategoryLabel(request.getCategoryLabel() != null ? request.getCategoryLabel() : request.getCategory());
        project.setIcon(request.getIcon() != null ? request.getIcon() : "code-circle");
        project.setIconBgColor(request.getIconBgColor() != null ? request.getIconBgColor() : "#2563eb");
        project.setUrl(request.getUrl());
        if (request.getIsFavorite() != null) {
            project.setFavorite(request.getIsFavorite());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getEnvironment() != null) {
            project.setEnvironment(request.getEnvironment());
        }
        if (request.getVersion() != null) {
            project.setVersion(request.getVersion());
        }
        if (request.getTeam() != null) {
            project.setTeam(request.getTeam());
        }
        if (request.getUptime() != null) {
            project.setUptime(request.getUptime());
        }
        if (request.getLastDeploy() != null) {
            project.setLastDeploy(request.getLastDeploy());
        }
        if (request.getAccessCount() != null) {
            project.setAccessCount(request.getAccessCount());
        }
    }
}
