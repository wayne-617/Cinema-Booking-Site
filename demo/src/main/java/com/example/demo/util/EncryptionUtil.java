package com.example.demo.util;

import io.github.cdimascio.dotenv.Dotenv;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    private static final byte[] keyBytes;

    static {
        Dotenv dotenv = Dotenv.configure().directory(".").load();
        String key = dotenv.get("APP_ENCRYPTION_KEY");

        if (key == null || key.isEmpty()) {
            throw new RuntimeException("APP_ENCRYPTION_KEY not set in .env!");
        }

        // Your key is Base64 encoded → must decode
        keyBytes = Base64.getDecoder().decode(key);

        // AES requires 16, 24, or 32 byte key
        if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32) {
            throw new RuntimeException("APP_ENCRYPTION_KEY must decode to 16, 24, or 32 bytes (your key is " 
                + keyBytes.length + " bytes)");
        }
    }

    public static String encrypt(String plainText) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);

            byte[] encrypted = cipher.doFinal(plainText.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);

        } catch (Exception e) {
            throw new RuntimeException("Error encrypting: " + e.getMessage(), e);
        }
    }

    public static String decrypt(String cipherText) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);

            byte[] decoded = Base64.getDecoder().decode(cipherText);
            byte[] original = cipher.doFinal(decoded);

            return new String(original);

        } catch (Exception e) {
            throw new RuntimeException("Error decrypting: " + e.getMessage(), e);
        }
    }
}
