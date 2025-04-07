package com.notificationService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import java.util.Map;

@Configuration
public class WebSocketConfig {

    @Value("${websocket.path}")
    private String path;

    @Bean
    public HandlerMapping webSocketMapping(WebSocketService handler) {
        return new SimpleUrlHandlerMapping(Map.of(path, handler), 1);
    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }
}