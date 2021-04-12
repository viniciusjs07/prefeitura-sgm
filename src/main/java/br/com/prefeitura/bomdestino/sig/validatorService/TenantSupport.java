package br.com.prefeitura.bomdestino.sig.validatorService;

public interface TenantSupport {
    void setTenantId(Long tenantId);
    Long getTenantId();
}
