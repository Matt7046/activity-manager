package com.common.configurations.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@ConditionalOnProperty(name = "app.elasticsearch.enabled", havingValue = "true") // Si attiva solo se vero
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    private final SslBundles sslBundles;

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUri;

    public ElasticsearchConfig(SslBundles sslBundles) {
        this.sslBundles = sslBundles;
    }

    @Override
    public ClientConfiguration clientConfiguration() {
        // Puliamo l'URI per il metodo connectedTo
        String host = elasticsearchUri.replace("https://", "").replace("http://", "");

        return ClientConfiguration.builder()
            .connectedTo(host)
            // Qui diciamo al client di usare il certificato che abbiamo nel bundle
            .usingSsl(sslBundles.getBundle("elastic-bundle").createSslContext())
            .withBasicAuth("elastic", "password")
            .build();
    }
}