package br.com.prefeitura.bomdestino.sig.validatorService;

public class TenantContext {

    private static final ThreadLocal<Long> currentTenant = new InheritableThreadLocal<>();

    public static Long getCurrentTenant() {
        return currentTenant.get();
    }

    public static void setCurrentTenant(Long tenant) {
        currentTenant.set(tenant);
    }

    public static void clear() {
        currentTenant.remove();
    }

}
