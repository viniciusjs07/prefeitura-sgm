package br.com.prefeitura.bomdestino.sig.config;

import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.ElasticSearchInvalidException;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;

import java.io.IOException;

@Configuration
class RestClientConfig extends AbstractElasticsearchConfiguration {

    @Bean
    public RestHighLevelClient elasticsearchClient() {
        final ClientConfiguration clientConfiguration = ClientConfiguration.create("localhost:9200");
        try (RestClients.ElasticsearchRestClient client = RestClients.create(clientConfiguration)) {
            return client.rest();
        } catch (IOException e) {
            throw new ElasticSearchInvalidException(ErrorConstants.CLIENT_REST_ERROR_CREATED);
        }
    }
}
