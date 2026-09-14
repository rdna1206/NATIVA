import { 
  db, 
  collection, 
  addDoc, 
  onSnapshot 
} from '../lib/firebase';
import { AnalyticsEvent } from '../types';

const ANALYTICS_COLLECTION = 'analytics';

export interface AnalyticsSummary {
  totalVisits: number;
  totalCtaClicks: number;
  totalRequests: number;
  conversionRate: number;
  ctaBreakdown: { target: string; count: number }[];
  dailyTrends: { date: string; visits: number; requests: number; clicks: number }[];
  topProducts: { name: string; requests: number }[];
}

export const analyticsService = {
  // Track an event safely
  async trackEvent(eventType: AnalyticsEvent['eventType'], target: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const colRef = collection(db, ANALYTICS_COLLECTION);
      const event: AnalyticsEvent = {
        eventType,
        target,
        metadata: metadata || {},
        timestamp: new Date().toISOString()
      };
      await addDoc(colRef, event);
    } catch (err) {
      // Local fallback in case of network constraint
      try {
        const localEvents: AnalyticsEvent[] = JSON.parse(localStorage.getItem('nativa_analytics_local') || '[]');
        localEvents.push({
          eventType,
          target,
          metadata: metadata || {},
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('nativa_analytics_local', JSON.stringify(localEvents.slice(-200)));
      } catch (localErr) {
        console.warn('Analytics logging notice:', localErr);
      }
    }
  },

  // Alias for trackEvent
  async logEvent(eventType: AnalyticsEvent['eventType'], target: string, metadata?: Record<string, unknown>): Promise<void> {
    return this.trackEvent(eventType, target, metadata);
  },

  // Log page view convenience helper
  async logPageView(target: string = 'landing_page'): Promise<void> {
    return this.trackEvent('page_view', target);
  },

  // Subscribe to real analytics events
  subscribeEvents(callback: (events: AnalyticsEvent[]) => void): () => void {
    const getLocal = (): AnalyticsEvent[] => {
      try {
        return JSON.parse(localStorage.getItem('nativa_analytics_local') || '[]');
      } catch {
        return [];
      }
    };

    if (!db) {
      callback(getLocal());
      return () => {};
    }

    try {
      const colRef = collection(db, ANALYTICS_COLLECTION);
      
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const list: AnalyticsEvent[] = [];
        snapshot.forEach((d) => {
          list.push({ ...(d.data() as AnalyticsEvent), id: d.id });
        });
        
        // Combine with local events if any
        try {
          const localEvents = getLocal();
          localEvents.forEach(locEv => {
            if (!list.some(e => e.id === locEv.id)) {
              list.push(locEv);
            }
          });
        } catch (e) {
          // ignore
        }
        
        callback(list);
      }, (error) => {
        console.warn('Firestore analytics subscription error, reading local fallback:', error);
        callback(getLocal());
      });

      return unsubscribe;
    } catch {
      callback(getLocal());
      return () => {};
    }
  }
};
