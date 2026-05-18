package com.common.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DisabledEmailSender implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(DisabledEmailSender.class);

    @Override
    public void sendHtml(String toEmail, String subject, String htmlBody) {
        log.info("[email] invio disabilitato – skip verso {} oggetto \"{}\"", toEmail, subject);
    }
}
