type AnalyticsPayload = Record<string, unknown>;

class AnalyticsService {
  track(event: string, payload: AnalyticsPayload = {}): void {
    if (__DEV__) {
      console.log(`[analytics] ${event}`, payload);
    }
  }
}

export const analyticsService = new AnalyticsService();
