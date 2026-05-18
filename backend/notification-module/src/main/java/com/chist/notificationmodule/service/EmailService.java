package com.chist.notificationmodule.service;

import com.chist.notificationmodule.dto.EmailNotification;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendEmail(EmailNotification notification){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(notification.getTo());
        message.setSubject(notification.getSubject());
        message.setText(notification.getBody());
        mailSender.send(message);
    }

    @Async
    public void sendRegistrationEmail(String to,String username){
        EmailNotification notification = EmailNotification.builder()
                .to(to)
                .subject("Welcome to Chist!")
                .body("Welcome " + username + ",\n\nYou've successfully signed into Chist! " +
                        "You can start cleaning and winning points!\n\n-TheChist Team")
                .build();
        sendEmail(notification);
    }

    @Async
    public void sendTaskCompletionEmail(String to,String username,int points){
        EmailNotification notification = EmailNotification.builder()
                .to(to)
                .subject("Cleaning Task Completed!")
                .body("Hello " + username + ",\n\nYou've successfully finished a cleaning task and won " + points
                + " points!\n\n-Chist Team")
                .build();
        sendEmail(notification);
    }

    public void sendRewardEmail(String to,String username, String rewardTitle){
        EmailNotification notification = EmailNotification.builder()
                .to(to)
                .subject("You got a reward!")
                .body("Hello " + username + ",\n\nYou've won a new reward with you points: "
                                + rewardTitle + "!\n\n-Chist Team")
                .build();
        sendEmail(notification);
    }
}
