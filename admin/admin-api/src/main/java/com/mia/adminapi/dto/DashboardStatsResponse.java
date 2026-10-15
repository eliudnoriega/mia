package com.mia.adminapi.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalProjects;
    private long activeProjects;
    private long maintenanceProjects;
    private long offlineProjects;
    private long favoritesCount;
    private Map<String, Long> projectsByCategory;
    private Map<String, Long> projectsByEnvironment;
    private List<ProjectResponse> topProjects;
    private List<ProjectResponse> recentProjects;

    public DashboardStatsResponse() {
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getMaintenanceProjects() {
        return maintenanceProjects;
    }

    public void setMaintenanceProjects(long maintenanceProjects) {
        this.maintenanceProjects = maintenanceProjects;
    }

    public long getOfflineProjects() {
        return offlineProjects;
    }

    public void setOfflineProjects(long offlineProjects) {
        this.offlineProjects = offlineProjects;
    }

    public long getFavoritesCount() {
        return favoritesCount;
    }

    public void setFavoritesCount(long favoritesCount) {
        this.favoritesCount = favoritesCount;
    }

    public Map<String, Long> getProjectsByCategory() {
        return projectsByCategory;
    }

    public void setProjectsByCategory(Map<String, Long> projectsByCategory) {
        this.projectsByCategory = projectsByCategory;
    }

    public Map<String, Long> getProjectsByEnvironment() {
        return projectsByEnvironment;
    }

    public void setProjectsByEnvironment(Map<String, Long> projectsByEnvironment) {
        this.projectsByEnvironment = projectsByEnvironment;
    }

    public List<ProjectResponse> getTopProjects() {
        return topProjects;
    }

    public void setTopProjects(List<ProjectResponse> topProjects) {
        this.topProjects = topProjects;
    }

    public List<ProjectResponse> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<ProjectResponse> recentProjects) {
        this.recentProjects = recentProjects;
    }
}
