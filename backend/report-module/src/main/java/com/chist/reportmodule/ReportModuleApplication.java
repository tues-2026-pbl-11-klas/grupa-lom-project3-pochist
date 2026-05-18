package com.chist.reportmodule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ReportModuleApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReportModuleApplication.class, args);
    }

}
