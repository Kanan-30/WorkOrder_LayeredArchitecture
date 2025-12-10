package com.utility.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "work_orders")
public class WorkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    // F07: Location Data
    private Double latitude;
    private Double longitude;
    private Double radiusMeters;

    private LocalDateTime scheduledTime;

    @Enumerated(EnumType.STRING)
    private WorkOrderStatus status;

    private String conflictReason;
}