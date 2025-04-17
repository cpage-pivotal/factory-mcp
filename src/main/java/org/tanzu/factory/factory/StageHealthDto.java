package org.tanzu.factory.factory;

import java.util.List;

public class StageHealthDto {
    private Long stageId;
    private String stageName;
    private int sequenceOrder;
    private double overallHealthScore;
    private int totalDevices;
    private int operationalDevices;
    private List<DeviceHealthDto> devices;

    // Getters and setters
    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public int getSequenceOrder() {
        return sequenceOrder;
    }

    public void setSequenceOrder(int sequenceOrder) {
        this.sequenceOrder = sequenceOrder;
    }

    public double getOverallHealthScore() {
        return overallHealthScore;
    }

    public void setOverallHealthScore(double overallHealthScore) {
        this.overallHealthScore = overallHealthScore;
    }

    public int getTotalDevices() {
        return totalDevices;
    }

    public void setTotalDevices(int totalDevices) {
        this.totalDevices = totalDevices;
    }

    public int getOperationalDevices() {
        return operationalDevices;
    }

    public void setOperationalDevices(int operationalDevices) {
        this.operationalDevices = operationalDevices;
    }

    public List<DeviceHealthDto> getDevices() {
        return devices;
    }

    public void setDevices(List<DeviceHealthDto> devices) {
        this.devices = devices;
    }
}
