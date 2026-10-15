package com.mia.adminapi.repository;

import com.mia.adminapi.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String>, JpaSpecificationExecutor<Project> {

    long countByStatus(String status);

    long countByIsFavorite(boolean isFavorite);

    long countByCategory(String category);

    long countByEnvironment(String environment);

    @Query("SELECT p.category, COUNT(p) FROM Project p GROUP BY p.category")
    List<Object[]> countProjectsGroupedByCategory();

    @Query("SELECT p.environment, COUNT(p) FROM Project p GROUP BY p.environment")
    List<Object[]> countProjectsGroupedByEnvironment();

    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countProjectsGroupedByStatus();

    List<Project> findTop5ByOrderByAccessCountDesc();

    List<Project> findTop5ByOrderByCreatedAtDesc();
}
