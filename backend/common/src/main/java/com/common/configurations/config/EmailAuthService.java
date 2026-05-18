package com.common.configurations.config;

import com.common.mail.EmailHtmlTemplates;
import com.common.mail.EmailProperties;
import com.common.mail.EmailSender;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnBean(EmailSender.class)
public class EmailAuthService {

    private final EmailSender emailSender;
    private final EmailProperties emailProperties;

    public EmailAuthService(EmailSender emailSender, EmailProperties emailProperties) {
        this.emailSender = emailSender;
        this.emailProperties = emailProperties;
    }

    public void sendEmail(String toEmail, String subject, String temporaryPassword) {
        if (!emailProperties.isOperational()) {
            emailSender.sendHtml(toEmail, subject, "");
            return;
        }
        String html = EmailHtmlTemplates.passwordEmail(subject, temporaryPassword);
        emailSender.sendHtml(toEmail, subject, html);
    }
}
