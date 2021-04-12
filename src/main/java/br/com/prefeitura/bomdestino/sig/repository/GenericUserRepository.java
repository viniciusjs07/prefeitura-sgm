package br.com.prefeitura.bomdestino.sig.repository;

import br.com.prefeitura.bomdestino.sig.domain.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static br.com.prefeitura.bomdestino.sig.config.Constants.USERS_BY_EMAIL_CACHE;
import static br.com.prefeitura.bomdestino.sig.config.Constants.USERS_BY_LOGIN_CACHE;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
@Transactional
public interface GenericUserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByLogin(String login);

    Optional<User> findOneByLoginAndTenantId(String login, Long tenantId);

    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
    Optional<User> findOneByEmailIgnoreCase(String email);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesById(Long id);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE)
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByLoginNotAndBlindingIsFalse(Pageable pageable, String login);

    Page<User> findAllByLoginContainingIgnoreCaseOrFirstNameContainingIgnoreCaseAndBlindingIsFalse(Pageable pageable, String login, String firstName);

    List<User> findAllByTenantId(Long TenantId);
}
