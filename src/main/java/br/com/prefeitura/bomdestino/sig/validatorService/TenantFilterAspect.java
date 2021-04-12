package br.com.prefeitura.bomdestino.sig.validatorService;

import br.com.prefeitura.bomdestino.sig.service.AbstractService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TenantFilterAspect {

    @Before("execution(* br.com.prefeitura.bomdestino.sig.service..*(..))&& target(service) ")
    public void aroundExecution(JoinPoint pjp, AbstractService service) {
        org.hibernate.Filter filter = service.entityManager.unwrap(Session.class).enableFilter("tenantFilter");
        filter.setParameter("tenantId", this.getCurrentTenant());
        filter.validate();
    }

    private Long getCurrentTenant() {
        Long currentTenant = TenantContext.getCurrentTenant();
        if (currentTenant == null) {
            currentTenant = 1l;
        }
        return currentTenant;
    }

}
