package com.chist.verificationmodule.service;

import com.azure.ai.vision.imageanalysis.ImageAnalysisClientBuilder;
import com.azure.ai.vision.imageanalysis.ImageAnalysisAsyncClient;
import com.azure.ai.vision.imageanalysis.models.ImageAnalysisResult;
import com.azure.ai.vision.imageanalysis.models.VisualFeatures;
import com.azure.core.credential.KeyCredential;
import com.azure.core.util.BinaryData;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Set;

@Service
public class AiVerificationService {

    @Value("${COMPUTER_VISION_ENDPOINT}")
    private String endpoint;

    @Value("${COMPUTER_VISION_KEY}")
    private String key;

    private static final Set<String> TRASH_TAGS = Set.of(
            "trash", "garbage", "waste", "litter", "pollution", "debris",
            "junk", "bottle", "plastic", "rubbish", "dumpster", "recycling",
            "mess", "filth", "dump", "scrap", "rubble", "dirty"
    );
    private static final double CONFIDENCE_THRESHOLD = 0.50;

    @PostConstruct
    public void init() {
        System.out.println("=== Azure CV Config ===");
        System.out.println("Endpoint: " + endpoint);
        System.out.println("Key set: " + (key != null && !key.isBlank()));
        System.out.println("=======================");
    }

    private ImageAnalysisAsyncClient getClient() {
        return new ImageAnalysisClientBuilder()
                .endpoint(endpoint)
                .credential(new KeyCredential(key))
                .buildAsyncClient();
    }

    public Mono<Boolean> verifyHasTrashFromBytes(byte[] imageBytes) {
        return getClient().analyze(
                BinaryData.fromBytes(imageBytes),
                List.of(VisualFeatures.TAGS),
                null
        )
        .map(this::containsTrashTags)
        .doOnError(e -> System.err.println("Azure CV error: " + e.getMessage()))
        .onErrorReturn(false);
    }

    public Mono<Boolean> verifyCleanFromBytes(byte[] beforeBytes, byte[] afterBytes) {
        Mono<ImageAnalysisResult> beforeMono = getClient().analyze(
                BinaryData.fromBytes(beforeBytes),
                List.of(VisualFeatures.TAGS),
                null
        );
        Mono<ImageAnalysisResult> afterMono = getClient().analyze(
                BinaryData.fromBytes(afterBytes),
                List.of(VisualFeatures.TAGS),
                null
        );
        return Mono.zip(beforeMono, afterMono)
                .map(tuple -> {
                    boolean beforeHasTrash = containsTrashTags(tuple.getT1());
                    boolean afterHasTrash = containsTrashTags(tuple.getT2());
                    System.out.println("Before has trash: " + beforeHasTrash);
                    System.out.println("After has trash: " + afterHasTrash);
                    return beforeHasTrash && !afterHasTrash;
                })
                .doOnError(e -> System.err.println("Azure CV verifyClean error: " + e.getMessage()))
                .onErrorReturn(false);
    }

    private boolean containsTrashTags(ImageAnalysisResult result) {
        if (result.getTags() == null) return false;
        result.getTags().getValues().forEach(tag ->
                System.out.println("AZURE TAG: " + tag.getName() + " | confidence: " + tag.getConfidence())
        );
        return result.getTags().getValues().stream()
                .filter(tag -> tag.getConfidence() >= CONFIDENCE_THRESHOLD)
                .anyMatch(tag -> TRASH_TAGS.contains(tag.getName().toLowerCase()));
    }
}
