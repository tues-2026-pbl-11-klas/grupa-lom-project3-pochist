package com.chist.notificationmodule.service;

import com.chist.notificationmodule.dto.EmailNotification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    private EmailNotification testNotification;

    @BeforeEach
    void setUp() {
        testNotification = EmailNotification.builder()
                .to("test@test.com")
                .subject("Test Subject")
                .body("Test Body")
                .build();
    }

    @Test
    void sendEmail_success() {
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.sendEmail(testNotification);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendRegistrationEmail_success() {
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.sendRegistrationEmail("test@test.com", "testuser");

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendTaskCompletedEmail_success() {
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.sendTaskCompletionEmail("test@test.com", "testuser", 50);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendRewardEmail_success() {
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.sendRewardEmail("test@test.com", "testuser", "Еко Войн");

        verify(mailSender).send(any(SimpleMailMessage.class));
    }
}