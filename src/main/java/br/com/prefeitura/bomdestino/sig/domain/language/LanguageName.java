package br.com.prefeitura.bomdestino.sig.domain.language;

public enum LanguageName {
    PT_BR("Portuguese (Brazil)"),
    EN("English"),
    ES("Spanish");

    private String description;

    LanguageName(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}
