package com.chist.verificationmodule.service;

import com.chist.verificationmodule.dto.VerificationRequest;
import com.chist.verificationmodule.dto.VerificationResponse;
import com.chist.verificationmodule.exception.VerificationNotFoundException;
import com.chist.verificationmodule.model.Verification;
import com.chist.verificationmodule.model.VerificationStatus;
import com.chist.verificationmodule.model.VerificationType;
import com.chist.verificationmodule.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final GpsVerificationService gpsVerificationService;
    private final AiVerificationService aiVerificationService;

    public VerificationResponse verify(VerificationRequest request) {
        boolean gpsResult = gpsVerificationService.verify(
                request.getExpectedLatitude(),
                request.getExpectedLongitude(),
                request.getActualLatitude(),
                request.getActualLongitude()
        );

        boolean aiResult;

        try {
            if (request.getAfterPhotoUrl() == null || request.getAfterPhotoUrl().isBlank()) {
                byte[] beforeBytes = new java.net.URL(request.getBeforePhotoUrl()).openStream().readAllBytes();
                aiResult = Boolean.TRUE.equals(aiVerificationService.verifyHasTrashFromBytes(beforeBytes).block());
            } else {
                byte[] beforeBytes = new java.net.URL(request.getBeforePhotoUrl()).openStream().readAllBytes();
                byte[] afterBytes  = new java.net.URL(request.getAfterPhotoUrl()).openStream().readAllBytes();
                aiResult = Boolean.TRUE.equals(aiVerificationService.verifyCleanFromBytes(beforeBytes, afterBytes).block());
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch photo bytes: " + e.getMessage());
            aiResult = false;
        }

        VerificationStatus verificationStatus;
        String result;

        if (gpsResult && aiResult) {
            verificationStatus = VerificationStatus.APPROVED;
            result = "Both GPS and AI verification passed";
        } else if (gpsResult || aiResult) {
            verificationStatus = VerificationStatus.PENDING;
            result = "Partial verification - waiting for admin approval";
        } else {
            verificationStatus = VerificationStatus.REJECTED;
            result = "Both GPS and AI verification failed";
        }

        Verification verification = Verification.builder()
                .taskId(request.getTaskId())
                .type(VerificationType.AI)
                .status(verificationStatus)
                .actualLat(request.getActualLatitude())
                .actualLng(request.getActualLongitude())
                .result(result)
                .build();

        return mapToDTO(verificationRepository.save(verification));
    }

    private VerificationResponse mapToDTO(Verification verification) {
        return VerificationResponse.builder()
                .id(verification.getId())
                .taskId(verification.getTaskId())
                .type(verification.getType())
                .status(verification.getStatus())
                .result(verification.getResult())
                .actualLat(verification.getActualLat())
                .actualLng(verification.getActualLng())
                .createdAt(verification.getCreatedAt())
                .updatedAt(verification.getUpdatedAt())
                .build();
    }

    public VerificationResponse getById(UUID id) {
        return mapToDTO(verificationRepository.findById(id)
                .orElseThrow(() -> new VerificationNotFoundException("Verification not found")));
    }

    public List<VerificationResponse> getByTaskId(UUID taskId) {
        return verificationRepository.findByTaskId(taskId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public VerificationResponse adminApprove(UUID id) {
        Verification verification = verificationRepository.findById(id)
                .orElseThrow(() -> new VerificationNotFoundException("Verification not found"));
        verification.setStatus(VerificationStatus.APPROVED);
        verification.setResult("Approved by admin");
        return mapToDTO(verificationRepository.save(verification));
    }

    public VerificationResponse adminReject(UUID id) {
        Verification verification = verificationRepository.findById(id)
                .orElseThrow(() -> new VerificationNotFoundException("Verification not found"));
        verification.setStatus(VerificationStatus.REJECTED);
        verification.setResult("Rejected by admin");
        return mapToDTO(verificationRepository.save(verification));
    }
}
