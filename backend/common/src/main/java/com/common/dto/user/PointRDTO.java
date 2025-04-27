package com.common.dto.user;

import com.common.dto.structure.InterfaceDTO;

import java.util.List;

public record PointRDTO(Integer points, String numeroPunti, List<String> nameImage) implements InterfaceDTO {}
