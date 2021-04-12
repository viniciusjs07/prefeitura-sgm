package br.com.prefeitura.bomdestino.sig.service.util;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import br.com.prefeitura.bomdestino.sig.domain.Service;
import br.com.prefeitura.bomdestino.sig.exception.EntityAlreadyExistsException;
import br.com.prefeitura.bomdestino.sig.exception.SMGException;
import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.repository.ServiceRepository;
import br.com.prefeitura.bomdestino.sig.service.dto.ServiceDTO;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.InvalidServiceNameException;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.ServiceAlreadyUsedException;
import org.elasticsearch.common.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ValidatorService {

    @Autowired
    private ServiceRepository serviceRepository;

    public ValidatorService() {
        // Construct is empty
    }

    /**
     * Método que realiza a checagem das propriedades da entidade de serviço
     *
     * @param serviceDTO
     */
    public void checkService(ServiceDTO serviceDTO) {
        if (Strings.isNullOrEmpty(serviceDTO.getName())) {
            throw new InvalidServiceNameException(ErrorConstants.SERVICE_CANNOT_BE_NULL);
        }

        if (serviceDTO.getName().length() < 3) {
            throw new InvalidServiceNameException(ErrorConstants.SERVICE_MIN_LENGTH);
        }
    }


    public void checkDuplicatedServiceName(ServiceDTO serviceDTO) {
        final Optional<Service> productExistName = this.serviceRepository.findByNameIgnoreCase(serviceDTO.getName());
        if (productExistName.isPresent()) {
            throw new ServiceAlreadyUsedException(ErrorConstants.SERVICE_NAME_ALREADY_USED);
        }
    }

    public void checkServiceExists(ServiceDTO serviceDTO) {
        final Optional<Service> productFound = this.serviceRepository.findByNameIgnoreCase(serviceDTO.getName());
        if (productFound.isPresent() && !productFound.get().getId().equals(serviceDTO.getId())) {
            throw new EntityAlreadyExistsException(ErrorConstants.SERVICE_NAME_ALREADY_USED);
        }
    }

    public void validateCategory(Category category) {
        if (!category.isActivated()) {
            throw new SMGException(ErrorConstants.SERVICE_CANNOT_HAVE_INACTIVE_CATEGORY);
        }
    }

}

