package com.mia.adminapi.service;

import com.mia.adminapi.dto.CompanyRequest;
import com.mia.adminapi.dto.CompanyResponse;
import com.mia.adminapi.entity.Company;
import com.mia.adminapi.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(CompanyResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empresa no encontrada con ID: " + id));
        return CompanyResponse.fromEntity(company);
    }

    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        if (companyRepository.existsByName(request.getName().trim())) {
            throw new IllegalArgumentException("Ya existe una empresa con el nombre '" + request.getName() + "'.");
        }

        Company company = new Company(
                request.getName().trim(),
                request.getTaxId(),
                request.getAddress(),
                request.getPhone(),
                request.getEmail(),
                request.getWebsite(),
                request.getLogoUrl()
        );
        if (request.getActive() != null) {
            company.setActive(request.getActive());
        }

        Company saved = companyRepository.save(company);
        return CompanyResponse.fromEntity(saved);
    }

    @Transactional
    public CompanyResponse updateCompany(Long id, CompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empresa no encontrada con ID: " + id));

        String newName = request.getName().trim();
        if (!company.getName().equalsIgnoreCase(newName) && companyRepository.existsByName(newName)) {
            throw new IllegalArgumentException("Ya existe otra empresa con el nombre '" + newName + "'.");
        }

        company.setName(newName);
        company.setTaxId(request.getTaxId());
        company.setAddress(request.getAddress());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        company.setWebsite(request.getWebsite());
        company.setLogoUrl(request.getLogoUrl());
        if (request.getActive() != null) {
            company.setActive(request.getActive());
        }

        Company updated = companyRepository.save(company);
        return CompanyResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empresa no encontrada con ID: " + id));
        companyRepository.delete(company);
    }
}
