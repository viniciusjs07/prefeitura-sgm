package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import br.com.prefeitura.bomdestino.sig.service.CityHallService;
import br.com.prefeitura.bomdestino.sig.service.dto.ServiceDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.screens.service.ServiceListDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceResource {

    private CityHallService cityHallService;

    public ServiceResource(CityHallService cityHallService) {
        this.cityHallService = cityHallService;
    }

    /**
     * GET /products : get all products.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all products for specified page
     */
    @GetMapping
    @Secured({AuthoritiesConstants.R_SERVICE, AuthoritiesConstants.RW_SERVICE, AuthoritiesConstants.R_CITIZEN})
    public ResponseEntity<Page<ServiceListDTO>> getAll(@PageableDefault(size = 20)
                                                       @SortDefault.SortDefaults({
                                                               @SortDefault(sort = "activated", direction = Sort.Direction.DESC),
                                                               @SortDefault(sort = "name", direction = Sort.Direction.ASC)
                                                       }) Pageable pageable,
                                                       @RequestParam(required = false) String search) {

        List<ServiceListDTO> serviceListDTOS = new ArrayList<>();
        Page<ServiceDTO> serviceDTOS = this.cityHallService.getAll(pageable, search);
        for (ServiceDTO serviceDTO : serviceDTOS) {
            serviceListDTOS.add(new ServiceListDTO(serviceDTO));
        }
        return new ResponseEntity(new PageImpl(serviceListDTOS, pageable, serviceDTOS.getTotalElements()), HttpStatus.OK);
    }

    /**
     * GET /products/{id} :  get a product by ID
     *
     * @param id of the product to be retrieved
     * @return the product created
     */
    @GetMapping("/{id}")
    @Secured({AuthoritiesConstants.R_SERVICE, AuthoritiesConstants.RW_SERVICE, AuthoritiesConstants.R_CITIZEN})
    public ResponseEntity<ServiceDTO> getByID(@PathVariable Long id) {
        return ResponseUtil.wrapOrNotFound(this.cityHallService.getByID(id));
    }

    /**
     * POST /products :  create a product
     *
     * @param dto product DTO containing the data to be saved
     * @return the product created
     */
    @PostMapping
    @Secured({AuthoritiesConstants.RW_SERVICE})
    public ResponseEntity<ServiceDTO> create(@Valid @RequestBody ServiceDTO dto) {
        return new ResponseEntity<>(this.cityHallService.create(dto), HttpStatus.CREATED);
    }

    /**
     * POST /products/changeStatus :  change the product status (activated or inactivated)
     *
     * @param id of the product DTO to change the status
     * @return the updated product
     */
    @PostMapping("/changeStatus/{id}")
    @Secured({AuthoritiesConstants.RW_SERVICE})
    public ResponseEntity<ServiceDTO> changeStatus(@PathVariable Long id) {
        return new ResponseEntity<>(this.cityHallService.changeStatus(id), HttpStatus.OK);
    }

    /**
     * PUT /products :  update a product
     *
     * @param dto product DTO containing the data to be updated
     * @return the updated product
     */
    @PutMapping
    @Secured({AuthoritiesConstants.RW_SERVICE})
    public ResponseEntity<ServiceDTO> update(@Valid @RequestBody ServiceDTO dto) {
        return new ResponseEntity<>(this.cityHallService.update(dto), HttpStatus.OK);
    }

    @Transactional
    @GetMapping("/activated")
    @Secured({AuthoritiesConstants.R_SERVICE, AuthoritiesConstants.RW_SERVICE, AuthoritiesConstants.R_CITIZEN
    })
    public ResponseEntity<Page<ServiceDTO>> getAllActivated(Pageable pageable,
                                                            @PageableDefault(size = 20)
                                                            @RequestParam(required = false) String search) {
        return new ResponseEntity<>(this.cityHallService.getAllActivated(pageable, search), HttpStatus.OK);
    }

}
