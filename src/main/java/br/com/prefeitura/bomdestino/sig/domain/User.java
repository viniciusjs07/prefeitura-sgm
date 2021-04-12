package br.com.prefeitura.bomdestino.sig.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "user")
@DiscriminatorValue("DEFAULT")
public class User extends AbstractUser {

}
