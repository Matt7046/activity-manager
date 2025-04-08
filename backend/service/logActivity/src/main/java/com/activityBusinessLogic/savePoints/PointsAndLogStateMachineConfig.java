package com.activityBusinessLogic.savePoints;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

@Configuration
@EnableStateMachineFactory
public class PointsAndLogStateMachineConfig extends EnumStateMachineConfigurerAdapter<State, Event> {
    @Override
    public void configure(StateMachineStateConfigurer<State, Event> states) throws Exception {
        states
                .withStates()
                .initial(State.START)
                .state(State.SAVE_POINTS)
                .state(State.SAVE_LOG)
                .state(State.COMPENSATE)
                .state(State.SAVE_LOG_FAMILY)
                .state(State.COMPENSATE_FAMILY)
                .end(State.SUCCESS)
                .end(State.FAILED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<State, Event> transitions) throws Exception {
        transitions
                .withExternal()
                .source(State.START).target(State.SAVE_POINTS).event(Event.PROCESS_POINTS)
                .and()
                .withExternal()
                .source(State.SAVE_POINTS).target(State.SAVE_LOG).event(Event.LOG_SAVED)
                .and()
                .withExternal()
                .source(State.SAVE_LOG).target(State.SAVE_LOG_FAMILY).event(Event.LOG_FAMILY)
                .and()
                .withExternal()
                .source(State.SAVE_LOG_FAMILY).target(State.SUCCESS).event(Event.SUCCESS)
                .and()
                .withExternal()
                .source(State.SAVE_POINTS).target(State.COMPENSATE).event(Event.ERROR)
                .and()
                .withExternal()
                .source(State.SAVE_LOG).target(State.COMPENSATE_FAMILY).event(Event.ERROR)
                .and()
                .withExternal()
                .source(State.COMPENSATE).target(State.FAILED).event(Event.COMPENSATED)
                .and()
                .withExternal()
                .source(State.COMPENSATE_FAMILY).target(State.FAILED).event(Event.COMPENSATED_FAMILY);

    }
}
