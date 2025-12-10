package com.utility.platform.repository;

import com.utility.platform.model.WorkOrder;
import com.utility.platform.model.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    // Used for F10 (Manager view) and F12 (Field Tech view)
    List<WorkOrder> findByStatus(WorkOrderStatus status);

    // Used for F11 (Calendar view - finding all active work)
    List<WorkOrder> findAllByOrderByScheduledTimeDesc();
}