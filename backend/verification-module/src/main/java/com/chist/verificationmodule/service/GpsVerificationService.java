package com.chist.verificationmodule.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GpsVerificationService {

    @Value("${verification.gps.max-distance-meters}")
    private Double maxDistanceMeters;

    public boolean verify(double expectedLatitude, double expectedLongitude,
                          double actualLatitude, double actualLongitude) {
        double distance = calculateDistance(expectedLatitude,actualLatitude,expectedLongitude,actualLongitude);
        return distance <= maxDistanceMeters;
    }

    private double calculateDistance(double lat1,double lat2,double lon1,double lon2) {
        final int EARTH_RADIUS = 6371000;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lngDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}
