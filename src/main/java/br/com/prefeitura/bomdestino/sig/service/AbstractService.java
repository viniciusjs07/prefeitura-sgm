package br.com.prefeitura.bomdestino.sig.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

@Transactional
public abstract class AbstractService {

    @Autowired
    public EntityManager entityManager;
}
