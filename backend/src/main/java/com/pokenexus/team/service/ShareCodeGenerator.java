package com.pokenexus.team.service;

import java.security.SecureRandom;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class ShareCodeGenerator {

    public static final int LENGTH = 8;
    public static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    public static final Pattern FORMAT = Pattern.compile("[A-Za-z0-9]{" + LENGTH + "}");

    private final SecureRandom random = new SecureRandom();

    public String next() {
        StringBuilder code = new StringBuilder(LENGTH);
        for (int index = 0; index < LENGTH; index++) {
            code.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return code.toString();
    }

    public static boolean isValid(String shareCode) {
        return shareCode != null && FORMAT.matcher(shareCode).matches();
    }
}
