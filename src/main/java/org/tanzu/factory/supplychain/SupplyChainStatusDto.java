package org.tanzu.factory.supplychain;

import org.tanzu.factory.factory.ProductionOutputDto;
import java.time.LocalDate;
import java.util.List;

public class SupplyChainStatusDto {
    private LocalDate date;
    private int dailyTarget;
    private int currentOutput;
    private int projectedEndOfDayOutput;
    private double targetCompletionPercentage;
    private boolean onTrack;
    private List<ProductionOutputDto> stageOutputs;

    // Getters and setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getDailyTarget() {
        return dailyTarget;
    }

    public void setDailyTarget(int dailyTarget) {
        this.dailyTarget = dailyTarget;
    }

    public int getCurrentOutput() {
        return currentOutput;
    }

    public void setCurrentOutput(int currentOutput) {
        this.currentOutput = currentOutput;
    }

    public int getProjectedEndOfDayOutput() {
        return projectedEndOfDayOutput;
    }

    public void setProjectedEndOfDayOutput(int projectedEndOfDayOutput) {
        this.projectedEndOfDayOutput = projectedEndOfDayOutput;
    }

    public double getTargetCompletionPercentage() {
        return targetCompletionPercentage;
    }

    public void setTargetCompletionPercentage(double targetCompletionPercentage) {
        this.targetCompletionPercentage = targetCompletionPercentage;
    }

    public boolean isOnTrack() {
        return onTrack;
    }

    public void setOnTrack(boolean onTrack) {
        this.onTrack = onTrack;
    }

    public List<ProductionOutputDto> getStageOutputs() {
        return stageOutputs;
    }

    public void setStageOutputs(List<ProductionOutputDto> stageOutputs) {
        this.stageOutputs = stageOutputs;
    }
}
