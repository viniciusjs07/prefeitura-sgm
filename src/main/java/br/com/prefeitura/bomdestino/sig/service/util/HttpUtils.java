package br.com.prefeitura.bomdestino.sig.service.util;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Service
public class HttpUtils {

    // https://stackoverflow.com/a/55266907
    private static final String[] IP_HEADER_CANDIDATES = {
            "X-Forwarded-For", // AWS
            "REMOTE_ADDR"      // Local
    };

    public static String getClientIpAddressIfServletRequestExist() {
        if (RequestContextHolder.getRequestAttributes() == null) { return "0.0.0.0"; }

        final HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        for (String header: IP_HEADER_CANDIDATES) {
            final String ipList = request.getHeader(header);
            if (ipList != null && ipList.length() != 0 && !"unknown".equalsIgnoreCase(ipList)) {
                return ipList.split(",")[0];
            }
        }

        return request.getRemoteAddr();
    }

}
