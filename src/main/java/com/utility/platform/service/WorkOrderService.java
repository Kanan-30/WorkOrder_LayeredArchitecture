package com.utility.platform.service;

import com.utility.platform.model.WorkOrder;
import com.utility.platform.model.WorkOrderStatus;
import com.utility.platform.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkOrderService {

    @Autowired
    private WorkOrderRepository repository;

    @Autowired
    private ConflictDetectionEngine conflictEngine;

    // F07 & F08: Create Order with Check
    public WorkOrder createWorkOrder(WorkOrder order) {
        order.setScheduledTime(LocalDateTime.now()); // Simulating scheduling for 'now'

        String conflict = conflictEngine.checkConflicts(
                order.getLatitude(), order.getLongitude(), order.getRadiusMeters()
        );

        if (conflict != null) {
            order.setStatus(WorkOrderStatus.CONFLICT_DETECTED);
            order.setConflictReason(conflict);
        } else {
            // No conflict? Goes to Manager for Approval (F10)
            order.setStatus(WorkOrderStatus.PENDING_APPROVAL);
            order.setConflictReason("None");
        }

        return repository.save(order);
    }

    // F11: Get all for Calendar
    public List<WorkOrder> getAllWorkOrders() {
        return repository.findAllByOrderByScheduledTimeDesc();
    }

    // F10 (Manager) & F12 (Field Tech): Update Status
    public WorkOrder updateStatus(Long id, WorkOrderStatus newStatus) {
        WorkOrder order = repository.findById(id).orElseThrow();
        order.setStatus(newStatus);
        return repository.save(order);
    }
}