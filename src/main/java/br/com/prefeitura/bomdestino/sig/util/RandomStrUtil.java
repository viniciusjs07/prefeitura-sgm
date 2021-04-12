package br.com.prefeitura.bomdestino.sig.util;

import java.util.Date;
import java.util.Random;

public class RandomStrUtil {

    private static final int FILE_NAME_LENGTH = 24;

    private RandomStrUtil() {
    }

    public static String generateRandomString() {
        return generateRandomString(FILE_NAME_LENGTH);
    }

    public static String generateRandomString(int fileNameLength) {
        char[] values = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
                'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
                'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};

        StringBuilder out = new StringBuilder();

        Random random = new Random((new Date()).getTime());

        for (int i = 0; i < fileNameLength; i++) {
            int idx = random.nextInt(values.length);
            out.append(values[idx]);
        }
        return out.toString();
    }

}
