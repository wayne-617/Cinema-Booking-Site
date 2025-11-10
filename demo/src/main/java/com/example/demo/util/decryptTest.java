package com.example.demo.util;

public class decryptTest {

    public static void main(String[] args) {
        String test = "4111111111111111"; // example card number
        String encrypted = EncryptionUtil.encrypt(test);
        String decrypted = EncryptionUtil.decrypt(encrypted);

    System.out.println("Encrypted: " + encrypted);
    System.out.println("Decrypted: " + decrypted);
    }
}
