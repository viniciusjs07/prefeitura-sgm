package br.com.prefeitura.bomdestino.sig.service;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import br.com.prefeitura.bomdestino.sig.domain.Service;
import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.exception.NotFoundException;
import br.com.prefeitura.bomdestino.sig.repository.ServiceRepository;
import br.com.prefeitura.bomdestino.sig.service.dto.ServiceDTO;
import br.com.prefeitura.bomdestino.sig.service.enums.AuditEvents;
import br.com.prefeitura.bomdestino.sig.service.util.ValidatorService;
import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service class for managing city hall services.
 */
@org.springframework.stereotype.Service
@Transactional
public class CityHallService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(CityHallService.class);

    private ServiceRepository serviceRepository;

    private CategoryService categoryService;


    private ValidatorService validatorService;

    private final EventPublisherService eventPublisherService;

    private static final String EVENT_MESSAGE = "message=Service ";

    public CityHallService(ServiceRepository serviceRepository,
                           EventPublisherService eventPublisherService,
                           CategoryService categoryService,
                           ValidatorService validatorService) {
        this.serviceRepository = serviceRepository;
        this.eventPublisherService = eventPublisherService;
        this.categoryService = categoryService;
        this.validatorService = validatorService;
    }

    /**
     * Get all products.
     *
     * @param pageable with page and sort order specification
     * @return all products in the specified page
     */
    @Transactional(readOnly = true)
    public Page<ServiceDTO> getAll(Pageable pageable, String search) {
        if (Strings.isNullOrEmpty(search)) {
            return this.serviceRepository.findAll(pageable).map(ServiceDTO::new);
        }
        return this.serviceRepository.searchService(pageable, search, search).map(ServiceDTO::new);
    }

    /**
     * Get a product by ID
     *
     * @param id product ID
     * @return the product DTO
     */
    @Transactional(readOnly = true)
    public Optional<ServiceDTO> getByID(Long id) {
        Optional<ServiceDTO> productDTO = Optional.of(this.serviceRepository.findById(id)).get().map(ServiceDTO::new);
        log.debug("Returning product: {}", productDTO);
        return productDTO;
    }

    /**
     * Create a product
     *
     * @param serviceDTO to save in database
     * @return the saved product DTO
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public ServiceDTO create(ServiceDTO serviceDTO) {
        this.validatorService.checkDuplicatedServiceName(serviceDTO);
        this.validatorService.checkService(serviceDTO);

        Optional<Category> category = Optional.ofNullable(this.categoryService.getCategory(serviceDTO.getCategory().getId()));
        assert category.isPresent();
        this.validatorService.validateCategory(category.get());
        Service serviceToSave = new Service(serviceDTO, category.get());

        log.debug("Saving product: {}", serviceDTO);

        final Service newService = this.serviceRepository.save(serviceToSave);
        newService.setActivated(true);
        this.eventPublisherService.publishEvent(AuditEvents.SERVICE_CREATED, EVENT_MESSAGE + newService.getName() + " cadastrado", "id=" + newService.getId());
        return new ServiceDTO(newService);
    }


    /**
     * Update a product
     *
     * @param serviceDTO to update in database
     * @return the updated product DTO
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public ServiceDTO update(ServiceDTO serviceDTO) {
        Service service = this.getServiceById(serviceDTO.getId());
        this.validatorService.checkService(serviceDTO);
        this.validatorService.checkServiceExists(serviceDTO);
        Optional<Category> category = Optional.ofNullable(this.categoryService.getCategory(serviceDTO.getCategory().getId()));
        assert category.isPresent();
        if (!category.get().getId().equals(service.getCategory().getId())) {
            this.validatorService.validateCategory(category.get());
        }

        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setCategory(category.get());
        service.setActivated(serviceDTO.isActivated());
        this.eventPublisherService.publishEvent(AuditEvents.SERVICE_UPDATED, EVENT_MESSAGE + serviceDTO.getName() + " Atualizado", "id=" + service.getId());
        log.debug("Updating product: {}", serviceDTO);
        this.serviceRepository.save(service);
        return new ServiceDTO(service);
    }

    public Page<ServiceDTO> getAllActivated(Pageable pageable, String search) {
        if (!Strings.isNullOrEmpty(search)) {
            return this.serviceRepository.findProductBySearch(pageable, search).map(ServiceDTO::new);
        }
        return this.serviceRepository.findAllByActivated(pageable).map(ServiceDTO::new);
    }

    private Service getServiceById(Long id) {
        Optional<Service> productExist = this.serviceRepository.findById(id);
        if (!productExist.isPresent()) {
            throw new NotFoundException(ErrorConstants.PRODUCT_NOT_FOUND);
        }
        return productExist.get();
    }


    /**
     * Change category status (activated or inactivated)
     *
     * @param id of the category to change the status
     * @return updated category
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public ServiceDTO changeStatus(Long id) {
        Optional<Service> product = serviceRepository.findById(id);
        if (!product.isPresent()) {
            throw new NotFoundException(ErrorConstants.PRODUCT_NOT_FOUND);
        }
        product.get().setActivated(!product.get().isActivated());

        if (product.get().isActivated()) {
            eventPublisherService.publishEvent(AuditEvents.SERVICE_UPDATED, EVENT_MESSAGE + product.get().getName() + " Ativado", "id=" + id);
        } else {
            eventPublisherService.publishEvent(AuditEvents.SERVICE_UPDATED, EVENT_MESSAGE + product.get().getName() + " Desativado", "id=" + id);
        }

        log.debug("Changing product status: {}", product.get());
        return new ServiceDTO(serviceRepository.save(product.get()));
    }

}


