package br.com.prefeitura.bomdestino.sig.validatorService;

import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import java.util.Objects;

public class TenantListener {

    @PrePersist
    @PreUpdate
    @PreRemove
    public void setTenant(final Object entity) {
        if (entity instanceof TenantSupport && Objects.isNull(((TenantSupport) entity).getTenantId())) {
            ((TenantSupport) entity).setTenantId(TenantContext.getCurrentTenant());
        }
    }

}
