package com.utility.platform.model;

public enum WorkOrderStatus {
    DRAFT,
    PENDING_APPROVAL,   // Waiting for Manager (F10)
    CONFLICT_DETECTED,  // Blocked by System (F08)
    APPROVED,           // Ready for Field Tech (F10)
    IN_PROGRESS,        // Field Tech onsite (F12)
    COMPLETED,          // Field Tech finished (F12)
    REJECTED            // Manager denied
}