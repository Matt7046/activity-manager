package com.activityService.dto;

import com.common.dto.structure.Choice;

import java.util.List;

public class GPTResponse {
    private List<Choice> choices;

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }
}
