package com.common.mail;

public interface EmailSender {

    void sendHtml(String toEmail, String subject, String htmlBody);
}
