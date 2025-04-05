package com.common.configurations;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${mongo.uri}")
    private String mongoUri;

    @Value("${mongo.tls.cert}")
    private String certFilePath; // Il percorso al file PEM combinato

    @Value("${mongo.tls.key}")
    private String certKeyFilePath; // Il percorso al file PEM combinato

    @Bean
    public MongoClient mongoClient() {
        MongoClientSettings.Builder mongoClientSettingsBuilder = MongoClientSettings.builder();

        // Aggiungi le impostazioni TLS/SSL
        mongoClientSettingsBuilder.applyToSslSettings(builder -> {
            try {
                builder.enabled(true)
                        .invalidHostNameAllowed(true)
                        .context(getSslContext(certFilePath));
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Aggiungi il resto delle impostazioni MongoDB
        MongoClientSettings mongoClientSettings = mongoClientSettingsBuilder
                .applyConnectionString(new ConnectionString(mongoUri))
                .build();
                
                MongoClient mongoClient =   MongoClients.create(mongoClientSettings);
                    // Forza l'utilizzo del database 'demo'
        return mongoClient;
    }

    private SSLContext getSslContext(String certFilePath) throws Exception {
        // Carica il certificato e la chiave privata dal file PEM
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, null); // inizializza KeyStore vuoto

        // Leggi il file PEM con BouncyCastle
        try (InputStream certInputStream = new FileInputStream(certFilePath)) {
            PrivateKey privateKey = loadPrivateKey(certKeyFilePath);
            // Aggiungi il certificato (se presente) e la chiave privata al KeyStore
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            X509Certificate certificate = (X509Certificate) certificateFactory.generateCertificate(certInputStream);

            keyStore.setKeyEntry("client-key", privateKey, null, new java.security.cert.Certificate[] { certificate });
        }

        // Creazione di un KeyManagerFactory con il KeyStore
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keyStore, null); // Nessuna password per il KeyStore

        // Creazione di TrustManagerFactory
        TrustManagerFactory trustManagerFactory = TrustManagerFactory
                .getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init((KeyStore) null); // Usando il TrustStore di default

        // Creazione dell'SSLContext
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), new SecureRandom());
        return sslContext;
    }

    @Bean
    public X509Certificate mongoClientCertificate() throws GeneralSecurityException, IOException {
        // Carica il certificato dal file PEM
        try (InputStream certInputStream = new FileInputStream(certFilePath)) {
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            return (X509Certificate) certificateFactory.generateCertificate(certInputStream);
        }
    }

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoCredentialCustomizer(X509Certificate mongoClientCertificate) {
        String subject = mongoClientCertificate.getSubjectX500Principal().getName();
        return clientSettingsBuilder -> clientSettingsBuilder.credential(
                MongoCredential.createMongoX509Credential(subject) // RFC2253
        );
    }

    public static PrivateKey loadPrivateKey(String pathToKeyFile) throws Exception {
        // Leggi il contenuto del file della chiave privata
        FileInputStream keyFile = new FileInputStream(pathToKeyFile);
        byte[] keyBytes = new byte[keyFile.available()];
        keyFile.read(keyBytes);
        keyFile.close();

        // Decodifica la chiave privata in formato PEM (se è in formato PEM)
        String keyString = new String(keyBytes);
        keyString = keyString.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replaceAll("\\s+", "");
        byte[] decodedKey = Base64.getDecoder().decode(keyString);

        // Crea la chiave privata da un oggetto PKCS8EncodedKeySpec
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");  // Usa "RSA" o "EC" a seconda del tipo di chiave
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
        return keyFactory.generatePrivate(keySpec);
    }

    @Override
    protected String getDatabaseName() {
       return "demoProd";
    }
}
