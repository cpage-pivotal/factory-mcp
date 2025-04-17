package org.tanzu.factory.factory;

import java.time.LocalDateTime;

public class ProductionOutputDto {
    private int stageOrder;
    private String stageName;
    private int unitsProduced;
    private int defectiveUnits;
    private double effectiveYieldPercentage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Getters and setters
    public int getStageOrder() {
        return stageOrder;
    }

    public void setStageOrder(int stageOrder) {
        this.stageOrder = stageOrder;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public int getUnitsProduced() {
        return unitsProduced;
    }

    public void setUnitsProduced(int unitsProduced) {
        this.unitsProduced = unitsProduced;
    }

    public int getDefectiveUnits() {
        return defectiveUnits;
    }

    public void setDefectiveUnits(int defectiveUnits) {
        this.defectiveUnits = defectiveUnits;
    }

    public double getEffectiveYieldPercentage() {
        return effectiveYieldPercentage;
    }

    public void setEffectiveYieldPercentage(double effectiveYieldPercentage) {
        this.effectiveYieldPercentage = effectiveYieldPercentage;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
