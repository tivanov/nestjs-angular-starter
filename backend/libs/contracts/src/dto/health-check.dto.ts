export type HealthIndicatorStatus = 'up' | 'down';

export interface HealthIndicatorResultDto {
  status: HealthIndicatorStatus;
  [key: string]: unknown;
}

export type HealthCheckStatus = 'error' | 'ok' | 'shutting_down';

export interface HealthCheckResultDto {
  status: HealthCheckStatus;
  info?: Record<string, HealthIndicatorResultDto>;
  error?: Record<string, HealthIndicatorResultDto>;
  details: Record<string, HealthIndicatorResultDto>;
}
