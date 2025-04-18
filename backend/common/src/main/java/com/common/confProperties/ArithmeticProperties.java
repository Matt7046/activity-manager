package com.common.confProperties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "error.document.arithmetic")
@Data
public class ArithmeticProperties {
    private String arithmetic;
}
