package com.heritageroom.heritageroom.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class SuppressAuthPopupFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        chain.doFilter(request, response);

        if (response instanceof HttpServletResponse res && res.getStatus() == 401) {
            res.setHeader("WWW-Authenticate", ""); // ← Previene popup browser
        }
    }
}
