package br.com.prefeitura.bomdestino.sig.logs.enuns;

import lombok.Getter;

@Getter
public enum LogType {

    LOG_SUCCESS("Log Success:\n"),
    LOG_ERROR("Log Error:\n"),
    LOG_INFO("Log Info:\n");

    private String description;

    LogType(String description) {
        this.description = description;
    }
}
