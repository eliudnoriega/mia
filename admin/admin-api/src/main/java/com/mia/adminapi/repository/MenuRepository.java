package com.mia.adminapi.repository;

import com.mia.adminapi.entity.Menu;
import com.mia.adminapi.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "LEFT JOIN m.roles r " +
           "LEFT JOIN m.companies c " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "AND (r IN :roles OR m.roles IS EMPTY) " +
           "AND (c.id = :companyId OR m.companies IS EMPTY) " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProjectAndRolesAndCompany(
            @Param("projectId") String projectId,
            @Param("roles") Collection<Role> roles,
            @Param("companyId") Long companyId
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "LEFT JOIN m.companies c " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "AND (c.id = :companyId OR m.companies IS EMPTY) " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProjectAndCompany(
            @Param("projectId") String projectId,
            @Param("companyId") Long companyId
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "LEFT JOIN m.companies c " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "AND m.roles IS EMPTY " +
           "AND (c.id = :companyId OR m.companies IS EMPTY) " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProjectWithNoRolesAndCompany(
            @Param("projectId") String projectId,
            @Param("companyId") Long companyId
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "LEFT JOIN m.roles r " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "AND (r IN :roles OR m.roles IS EMPTY) " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProjectAndRoles(
            @Param("projectId") String projectId,
            @Param("roles") Collection<Role> roles
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProject(
            @Param("projectId") String projectId
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "AND m.roles IS EMPTY " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProjectWithNoRoles(
            @Param("projectId") String projectId
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "LEFT JOIN m.roles r " +
           "WHERE p.id = :projectId " +
           "AND m.active = true " +
           "AND (r IN :roles OR m.roles IS EMPTY) " +
           "AND m.companies IS EMPTY " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findActiveMenusByProjectAndRolesNoCompany(
            @Param("projectId") String projectId,
            @Param("roles") Collection<Role> roles
    );

    @Query("SELECT DISTINCT m FROM Menu m " +
           "JOIN m.projects p " +
           "WHERE p.id = :projectId " +
           "ORDER BY m.orderIndex ASC")
    List<Menu> findByProjectId(@Param("projectId") String projectId);

    List<Menu> findByParentIsNullOrderByOrderIndexAsc();

    boolean existsByName(String name);

    Optional<Menu> findByName(String name);
}
