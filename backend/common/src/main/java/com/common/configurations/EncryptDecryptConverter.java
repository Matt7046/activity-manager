package com.common.configurations;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.activityManager.exception.DecryptException;

@Component
public class EncryptDecryptConverter implements Converter<String, String> {

    @Autowired
    PropertiesKey propertiesKey;
    private static final String ALGORITHM = "AES";

    @Override
    public String convert(String source) {
        try {
            if (source != null) {
                // Criptografa il dato
                return encrypts(source);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return source;
    }

    public String decrypt(String encryptedData) throws DecryptException {

        if (encryptedData != null) {
            // Decripta il dato
            return decrypts(encryptedData);
        }
        return encryptedData;
    }

    public String encrypts(String data) throws DecryptException {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKey key = propertiesKey.getSecretCryptKey();
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new DecryptException(e.getMessage());
        }
    }

    // Decripta una stringa
    public String decrypts(String encryptedData) throws DecryptException {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKey key = propertiesKey.getSecretCryptKey();
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            byte[] decryptedData = cipher.doFinal(decodedData);
            return new String(decryptedData);
        } catch (Exception e) {
            throw new DecryptException(e.getMessage());
        }
    }
}
