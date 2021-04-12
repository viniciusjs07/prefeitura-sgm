package br.com.prefeitura.bomdestino.sig.service.dto;

import br.com.prefeitura.bomdestino.sig.util.RegexConstant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordUpdateDTO {

    @NotBlank(message = "{error.user.password.notBlank}")
    @Size(min = 7, message = "{error.user.password.size}")
    @Pattern(regexp = RegexConstant.PASSWORD_REGEX, message = "{error.user.password.pattern}")
    private String newPassword;

}
