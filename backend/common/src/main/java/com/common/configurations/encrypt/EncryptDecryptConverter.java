package com.common.configurations.encrypt;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;

import com.common.configurations.structure.PropertiesKey;
import com.common.structure.messages.DecryptMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.common.structure.exception.DecryptException;

/**
 * Cifratura esplicita per entità/DTO (mapper, repository).
 * Non implementa {@code Converter<String, String>}: Spring la registrerebbe globalmente
 * e cifrerebbe anche {@code @PathVariable} / query param (es. topic=tutorial).
 */
@Component
public class EncryptDecryptConverter {

    @Autowired
    PropertiesKey propertiesKey;
    @Autowired
    DecryptMessages decryptMessages;
    @Value("${app.algorithm1}")
    private String alghorithm;

    /** Usato dai mapper per persistere email e campi sensibili (sempre da valore in chiaro). */
    public String convert(String source) {
        if (source == null) {
            return null;
        }
        return encrypts(source);
    }

    /**
     * Path param / query in chiaro (es. email, ObjectId) oppure già cifrato (legacy).
     * Se non è ciphertext valido, restituisce il valore originale.
     */
    public String safeDecrypt(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        try {
            return decrypts(value);
        } catch (DecryptException e) {
            return value;
        }
    }

    /**
     * Chiave per query Mongo su campi cifrati: accetta email in chiaro dall'API o ciphertext già persistito.
     */
    public String storageForm(String plainOrStored) {
        if (plainOrStored == null || plainOrStored.isBlank()) {
            return plainOrStored;
        }
        try {
            decrypts(plainOrStored);
            return plainOrStored;
        } catch (DecryptException e) {
            return encrypts(plainOrStored);
        }
    }

    public String decrypt(String encryptedData) throws DecryptException {
        if (encryptedData != null) {
            return decrypts(encryptedData);
        }
        return null;
    }

    public String encrypts(String data) throws DecryptException {
        try {
            Cipher cipher = Cipher.getInstance(alghorithm);
            SecretKey key = propertiesKey.getSecretCryptKey();
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new DecryptException(decryptMessages.operationFailed());
        }
    }

    private String decrypts(String encryptedData) throws DecryptException {
        try {
            Cipher cipher = Cipher.getInstance(alghorithm);
            SecretKey key = propertiesKey.getSecretCryptKey();
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            byte[] decryptedData = cipher.doFinal(decodedData);
            return new String(decryptedData);
        } catch (Exception e) {
            throw new DecryptException(decryptMessages.operationFailed());
        }
    }
}
