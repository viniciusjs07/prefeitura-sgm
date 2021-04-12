package br.com.prefeitura.bomdestino.sig.web.rest.generate;

import br.com.prefeitura.bomdestino.sig.domain.language.Language;
import br.com.prefeitura.bomdestino.sig.domain.language.LanguageName;
import br.com.prefeitura.bomdestino.sig.web.rest.TestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class LanguageGenerator {


    public Language createLanguage(LanguageName languageName) {
        Language language = new Language();
        language.setLanguageName(languageName);
        language.setActivated(true);
        return language;
    }

    public Language persistLanguage(MockMvc mockMvc, LanguageName languageName) throws Exception {
        final Language language = this.createLanguage(languageName);

        final MvcResult result = mockMvc.perform(post("/api/language")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtil.convertObjectToJsonBytes(language)))
                .andExpect(status().isCreated())
                .andReturn();

        final ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(result.getResponse().getContentAsString(), Language.class);
    }

}
