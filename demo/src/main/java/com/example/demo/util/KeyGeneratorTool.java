package com.example.demo.util;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;

public class KeyGeneratorTool {
    public static void main(String[] args) {
        try {
            // Generate a 256-bit AES key (strongest)
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            SecretKey secretKey = keyGen.generateKey();

            // Encode key to Base64 so it can be stored in .env
            String base64Key = Base64.getEncoder().encodeToString(secretKey.getEncoded());

            System.out.println("Your new APP_ENCRYPTION_KEY:");
            System.out.println(base64Key);
            System.out.println("\nAdd this line to your .env file:");
            System.out.println("APP_ENCRYPTION_KEY=" + base64Key);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
