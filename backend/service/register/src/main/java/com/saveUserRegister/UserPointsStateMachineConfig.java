package com.saveUserRegister;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

@Configuration
@EnableStateMachineFactory
public class UserPointsStateMachineConfig extends EnumStateMachineConfigurerAdapter<State, Event> {
    @Override
    public void configure(StateMachineStateConfigurer<State, Event> states) throws Exception {
        states
                .withStates()
                .initial(State.START)
                .state(State.SAVE_USER)
                .end(State.SUCCESS)
                .end(State.FAILED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<State, Event> transitions) throws Exception {
        transitions
                .withExternal()
                .source(State.START).target(State.SAVE_USER).event(Event.PROCESS_USER)
                .and()
                .withExternal()
                .source(State.SAVE_USER).target(State.FAILED).event(Event.ERROR);
    }
}
