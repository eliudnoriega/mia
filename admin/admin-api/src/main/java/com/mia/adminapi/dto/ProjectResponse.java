package com.mia.adminapi.dto;

import com.mia.adminapi.entity.Project;

import java.time.LocalDateTime;

public class ProjectResponse {

    private String id;
    private String title;
    private String subtitle;
    private String description;
    private String category;
    private String categoryLabel;
    private String icon;
    private String iconBgColor;
    private String url;
    private boolean isFavorite;
    private String status;
    private String environment;
    private String version;
    private String team;
    private String uptime;
    private String lastDeploy;
    private int accessCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectResponse() {
    }

    public static ProjectResponse fromEntity(Project project) {
        if (project == null) return null;
        ProjectResponse res = new ProjectResponse();
        res.setId(project.getId());
        res.setTitle(project.getTitle());
        res.setSubtitle(project.getSubtitle());
        res.setDescription(project.getDescription());
        res.setCategory(project.getCategory());
        res.setCategoryLabel(project.getCategoryLabel());
        res.setIcon(project.getIcon());
        res.setIconBgColor(project.getIconBgColor());
        res.setUrl(project.getUrl());
        res.setFavorite(project.isFavorite());
        res.setStatus(project.getStatus());
        res.setEnvironment(project.getEnvironment());
        res.setVersion(project.getVersion());
        res.setTeam(project.getTeam());
        res.setUptime(project.getUptime());
        res.setLastDeploy(project.getLastDeploy());
        res.setAccessCount(project.getAccessCount());
        res.setCreatedAt(project.getCreatedAt());
        res.setUpdatedAt(project.getUpdatedAt());
        return res;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getIconBgColor() {
        return iconBgColor;
    }

    public void setIconBgColor(String iconBgColor) {
        this.iconBgColor = iconBgColor;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getUptime() {
        return uptime;
    }

    public void setUptime(String uptime) {
        this.uptime = uptime;
    }

    public String getLastDeploy() {
        return lastDeploy;
    }

    public void setLastDeploy(String lastDeploy) {
        this.lastDeploy = lastDeploy;
    }

    public int getAccessCount() {
        return accessCount;
    }

    public void setAccessCount(int accessCount) {
        this.accessCount = accessCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
