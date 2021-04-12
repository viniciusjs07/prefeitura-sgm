package br.com.prefeitura.bomdestino.sig.service;

import br.com.prefeitura.bomdestino.sig.service.enums.AuditEvents;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.audit.listener.AuditApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class EventPublisherService {

    @Value("${test}")
    private Boolean isTest;

    private final ApplicationEventPublisher applicationEventPublisher;

    private final UserService userService;

    public EventPublisherService(UserService userService,
                          ApplicationEventPublisher applicationEventPublisher) {
        this.userService = userService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void publishEvent(AuditEvents event, String... data) {
        if (Boolean.TRUE.equals(isTest)) return;
        applicationEventPublisher.publishEvent(new AuditApplicationEvent(
                userService.getLoggedUser().getLogin(),
                event.name(),
                data
        ));
    }

}
