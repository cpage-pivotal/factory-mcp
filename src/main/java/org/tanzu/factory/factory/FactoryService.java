package org.tanzu.factory.factory;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FactoryService {
    private final ManufacturingStageRepository stageRepository;
    private final IoTDeviceRepository deviceRepository;
    private final ProductionMetricsRepository metricsRepository;

    public FactoryService(ManufacturingStageRepository stageRepository,
                          IoTDeviceRepository deviceRepository,
                          ProductionMetricsRepository metricsRepository) {
        this.stageRepository = stageRepository;
        this.deviceRepository = deviceRepository;
        this.metricsRepository = metricsRepository;
    }

    public List<StageHealthDto> getManufacturingStagesHealth() {
        List<ManufacturingStage> stages = stageRepository.findAll();
        return stages.stream()
                .map(this::convertToStageHealthDto)
                .collect(Collectors.toList());
    }

    public StageHealthDto getStageHealth(Long stageId) {
        Optional<ManufacturingStage> stageOpt = stageRepository.findById(stageId);
        return stageOpt.map(this::convertToStageHealthDto).orElse(null);
    }

    private StageHealthDto convertToStageHealthDto(ManufacturingStage stage) {
        List<IoTDevice> devices = deviceRepository.findByStage(stage);
        List<IoTDevice> operationalDevices = deviceRepository.findByStageAndOperationalTrue(stage);

        // Calculate overall health score as average of all device health scores
        double overallHealth = devices.stream()
                .mapToDouble(IoTDevice::getHealthScore)
                .average()
                .orElse(0.0);

        // Map devices to DTOs
        List<DeviceHealthDto> deviceDtos = devices.stream()
                .map(this::convertToDeviceHealthDto)
                .collect(Collectors.toList());

        return new StageHealthDto(
                stage.getId(),
                stage.getName(),
                stage.getSequenceOrder(),
                overallHealth,
                devices.size(),
                operationalDevices.size(),
                deviceDtos
        );
    }

    private DeviceHealthDto convertToDeviceHealthDto(IoTDevice device) {
        return new DeviceHealthDto(
                device.getId(),
                device.getDeviceId(),
                device.getName(),
                device.getDeviceType(),
                device.isOperational(),
                device.getHealthScore()
        );
    }
    @Transactional
    public void updateDeviceHealth(Long deviceId, boolean operational, double healthScore) {
        deviceRepository.findById(deviceId).ifPresent(device -> {
            device.setOperational(operational);
            device.setHealthScore(healthScore);
            deviceRepository.save(device);
        });
    }

    public ProductionOutputDto getStageOutput(int stageOrder, LocalDateTime startTime, LocalDateTime endTime) {
        ManufacturingStage stage = stageRepository.findBySequenceOrder(stageOrder);
        if (stage == null) {
            return null;
        }

        Integer unitsProduced = metricsRepository.getTotalUnitsByStageAndTimeRange(
                stageOrder, startTime, endTime);
        Integer defectiveUnits = metricsRepository.getTotalDefectiveUnitsByStageAndTimeRange(
                stageOrder, startTime, endTime);

        // Handle null values from the database
        unitsProduced = unitsProduced != null ? unitsProduced : 0;
        defectiveUnits = defectiveUnits != null ? defectiveUnits : 0;

        double effectiveYield = unitsProduced > 0
                ? 100.0 * (unitsProduced - defectiveUnits) / unitsProduced
                : 0.0;

        return new ProductionOutputDto(
                stageOrder,
                stage.getName(),
                unitsProduced,
                defectiveUnits,
                effectiveYield,
                startTime,
                endTime
        );
    }

    public List<ProductionOutputDto> getAllStagesOutput(LocalDateTime startTime, LocalDateTime endTime) {
        List<ManufacturingStage> stages = stageRepository.findAll();
        List<ProductionOutputDto> outputs = new ArrayList<>();

        for (ManufacturingStage stage : stages) {
            ProductionOutputDto output = getStageOutput(stage.getSequenceOrder(), startTime, endTime);
            if (output != null) {
                outputs.add(output);
            }
        }

        return outputs;
    }

    @Transactional
    public void recordProductionMetrics(Long deviceId, int unitsProduced, int defectiveUnits,
                                        double cycleTimeMinutes) {
        deviceRepository.findById(deviceId).ifPresent(device -> {
            ProductionMetrics metrics = new ProductionMetrics(
                    LocalDateTime.now(), unitsProduced, defectiveUnits, cycleTimeMinutes, device);
            metricsRepository.save(metrics);
        });
    }
}
