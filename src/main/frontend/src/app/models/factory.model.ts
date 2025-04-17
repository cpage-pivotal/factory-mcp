export interface DeviceHealth {
  id: number;
  deviceId: string;
  name: string;
  deviceType: string;
  operational: boolean;
  healthScore: number;
}

export interface StageHealth {
  stageId: number;
  stageName: string;
  sequenceOrder: number;
  overallHealthScore: number;
  totalDevices: number;
  operationalDevices: number;
  devices: DeviceHealth[];
}

export interface ProductionOutput {
  stageOrder: number;
  stageName: string;
  unitsProduced: number;
  defectiveUnits: number;
  effectiveYieldPercentage: number;
  startTime: string;
  endTime: string;
}

export interface SupplyChainStatus {
  date: string;
  dailyTarget: number;
  currentOutput: number;
  projectedEndOfDayOutput: number;
  targetCompletionPercentage: number;
  onTrack: boolean;
  stageOutputs: ProductionOutput[];
}

export interface DailyTarget {
  id: number;
  date: string;
  targetUnits: number;
}
