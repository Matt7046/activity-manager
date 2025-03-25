package com.common.dto;
import java.util.List;

public record ResponseDTO (Object jsonText, Object status, List<String> errors) {}