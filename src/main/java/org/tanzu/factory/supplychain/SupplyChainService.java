package org.tanzu.factory.supplychain;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tanzu.factory.factory.FactoryService;
import org.tanzu.factory.factory.ProductionOutputDto;
import org.tanzu.factory.factory.ProductionMetricsRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class SupplyChainService {
    private final DailyTargetRepository targetRepository;
    private final FactoryService factoryService;
    private final ProductionMetricsRepository metricsRepository;

    // Assume 8-hour production day (8am to 4pm)
    private static final LocalTime SHIFT_START = LocalTime.of(8, 0);
    private static final LocalTime SHIFT_END = LocalTime.of(16, 0);

    public SupplyChainService(DailyTargetRepository targetRepository,
                              FactoryService factoryService,
                              ProductionMetricsRepository metricsRepository) {
        this.targetRepository = targetRepository;
        this.factoryService = factoryService;
        this.metricsRepository = metricsRepository;
    }

    @Transactional
    public DailyTarget setDailyTarget(LocalDate date, int targetUnits) {
        Optional<DailyTarget> existingTarget = targetRepository.findByDate(date);

        if (existingTarget.isPresent()) {
            DailyTarget target = existingTarget.get();
            target.setTargetUnits(targetUnits);
            return targetRepository.save(target);
        } else {
            DailyTarget newTarget = new DailyTarget(date, targetUnits);
            return targetRepository.save(newTarget);
        }
    }

    public DailyTarget getDailyTarget(LocalDate date) {
        return targetRepository.findByDate(date)
                .orElse(new DailyTarget(date, 0)); // Return empty target if none exists
    }

    public SupplyChainStatusDto getCurrentSupplyChainStatus() {
        return getSupplyChainStatus(LocalDate.now());
    }

    public SupplyChainStatusDto getSupplyChainStatus(LocalDate date) {
        LocalDateTime now = LocalDateTime.now();

        // Get shift start and end times for the given date
        LocalDateTime shiftStart = LocalDateTime.of(date, SHIFT_START);
        LocalDateTime shiftEnd = LocalDateTime.of(date, SHIFT_END);

        // Ensure we don't query future times
        LocalDateTime currentEndTime = now.isBefore(shiftEnd) ? now : shiftEnd;

        // If we're querying a past date, use the full shift time
        if (date.isBefore(now.toLocalDate())) {
            currentEndTime = shiftEnd;
        }

        // Get the daily target
        DailyTarget target = getDailyTarget(date);

        // Get production outputs for each stage
        List<ProductionOutputDto> stageOutputs = factoryService.getAllStagesOutput(shiftStart, currentEndTime);

        // Final stage output is our current total production
        // (assumes stages are ordered and last stage is final assembly)
        int finalStageOrder = stageOutputs.stream()
                .mapToInt(ProductionOutputDto::getStageOrder)
                .max()
                .orElse(0);

        int currentOutput = stageOutputs.stream()
                .filter(output -> output.getStageOrder() == finalStageOrder)
                .mapToInt(output -> output.getUnitsProduced() - output.getDefectiveUnits())
                .findFirst()
                .orElse(0);

        // Calculate projected end-of-day output based on current production rate
        double hoursElapsed = date.equals(now.toLocalDate())
                ? Duration.between(shiftStart, currentEndTime).toHours() + 1 // Add 1 to avoid division by zero
                : Duration.between(shiftStart, shiftEnd).toHours();

        double hoursTotal = Duration.between(shiftStart, shiftEnd).toHours();

        int projectedOutput = (int) (currentOutput * (hoursTotal / hoursElapsed));

        // If we're past shift end, projected output is actual output
        if (now.isAfter(shiftEnd) && date.equals(now.toLocalDate())) {
            projectedOutput = currentOutput;
        }

        // Determine if we're on track to meet daily target
        double targetCompletion = target.getTargetUnits() > 0
                ? (double) currentOutput / target.getTargetUnits() * 100
                : 100.0;

        boolean onTrack = projectedOutput >= target.getTargetUnits();

        // Build the response
        SupplyChainStatusDto statusDto = new SupplyChainStatusDto();
        statusDto.setDate(date);
        statusDto.setDailyTarget(target.getTargetUnits());
        statusDto.setCurrentOutput(currentOutput);
        statusDto.setProjectedEndOfDayOutput(projectedOutput);
        statusDto.setTargetCompletionPercentage(targetCompletion);
        statusDto.setOnTrack(onTrack);
        statusDto.setStageOutputs(stageOutputs);

        return statusDto;
    }
}
