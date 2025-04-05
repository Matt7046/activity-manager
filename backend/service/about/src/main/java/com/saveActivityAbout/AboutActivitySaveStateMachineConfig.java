package com.saveActivityAbout;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

@Configuration
@EnableStateMachineFactory(name = "aboutActivitySaveStateMachineFactory")
public class AboutActivitySaveStateMachineConfig extends EnumStateMachineConfigurerAdapter<State, Event> {
    @Override
    public void configure(StateMachineStateConfigurer<State, Event> states) throws Exception {
        states
                .withStates()
                .initial(State.START)
                .state(State.SAVE_ACTIVITY)
                .end(State.SUCCESS)
                .end(State.FAILED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<State, Event> transitions) throws Exception {
        transitions
                .withExternal()
                .source(State.START).target(State.SAVE_ACTIVITY).event(Event.PROCESS_ACTIVITY)
                .and()
                .withExternal()
                .source(State.SAVE_ACTIVITY).target(State.FAILED).event(Event.ERROR);
    }
}
