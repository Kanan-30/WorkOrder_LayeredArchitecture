package com.utility.platform.controller;

import com.utility.platform.model.WorkOrder;
import com.utility.platform.model.WorkOrderStatus;
import com.utility.platform.service.WorkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkOrderController {

    @Autowired
    private WorkOrderService service;

    // F07: Planner creates order
    @PostMapping
    public WorkOrder createWorkOrder(@RequestBody WorkOrder workOrder) {
        return service.createWorkOrder(workOrder);
    }

    // F11: View Shared Calendar/List
    @GetMapping
    public List<WorkOrder> getAllOrders() {
        return service.getAllWorkOrders();
    }

    // F10 & F12: Status Updates (Approve, Start, Complete)
    @PutMapping("/{id}/status")
    public WorkOrder updateStatus(@PathVariable Long id, @RequestParam String status) {
        return service.updateStatus(id, WorkOrderStatus.valueOf(status));
    }
}