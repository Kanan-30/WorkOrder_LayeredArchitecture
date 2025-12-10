package com.utility.platform.service;

import org.springframework.stereotype.Service;

@Service
public class ConflictDetectionEngine {

    // Simulating a High Pressure Gas Main
    private static final double GAS_PIPE_LAT = 40.7128;
    private static final double GAS_PIPE_LON = -74.0060;
    private static final double SAFETY_BUFFER_METERS = 50.0;

    /**
     * F08: Automated Conflict Detection
     */
    public String checkConflicts(Double lat, Double lon, Double radius) {
        double distance = calculateDistance(lat, lon, GAS_PIPE_LAT, GAS_PIPE_LON);

        if (distance < (SAFETY_BUFFER_METERS + radius)) {
            // F09: In a real system, this triggers an Email/SMS service
            notifyAffectedParties("Gas Company", "Digging near Main Line");
            return "CRITICAL CONFLICT: Overlaps with High Pressure Gas Main (ID: GAS-99).";
        }
        return null;
    }

    /**
     * F09: Issue Conflict Notification (Simulation)
     */
    private void notifyAffectedParties(String assetOwner, String reason) {
        System.out.println(">>> [NOTIFICATION SYSTEM F09] Alert sent to " + assetOwner + ": " + reason);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    }
}