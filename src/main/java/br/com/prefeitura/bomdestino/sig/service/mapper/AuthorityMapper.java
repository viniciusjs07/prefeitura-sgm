package br.com.prefeitura.bomdestino.sig.service.mapper;

import br.com.prefeitura.bomdestino.sig.domain.Authority;
import br.com.prefeitura.bomdestino.sig.service.dto.AuthorityDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.AuthorityDTO;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthorityMapper {

    public Set<Authority> authorityDTOsToAuthorities(Set<AuthorityDTO> authorityDTOS) {
        return authorityDTOS.stream()
                .filter(Objects::nonNull)
                .map(this::authorityDTOToAuthority)
                .collect(Collectors.toSet());
    }

    public Authority authorityDTOToAuthority(AuthorityDTO authorityDTO) {
        if (authorityDTO == null) {
            return null;
        } else {
            Authority authority = new Authority();
            authority.setName(authorityDTO.getName());
            return authority;
        }
    }
}
