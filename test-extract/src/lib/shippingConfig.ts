// Shipping configuration stored in localStorage for admin control
// Default values if nothing saved

export interface StateDeliveryRate {
  state: string;
  charge: number;
  estimatedDays: string;
}

export interface ShippingConfig {
  gstRate: number;          // e.g. 5 = 5%
  freeShippingThreshold: number; // e.g. 5000
  stateRates: StateDeliveryRate[];
}

const STORAGE_KEY = 'testone_shipping_config';

export const ALL_STATES_AND_UTS: StateDeliveryRate[] = [
  // 28 States
  { state: 'Andhra Pradesh', charge: 80, estimatedDays: '3-5 days' },
  { state: 'Arunachal Pradesh', charge: 150, estimatedDays: '5-8 days' },
  { state: 'Assam', charge: 120, estimatedDays: '4-7 days' },
  { state: 'Bihar', charge: 70, estimatedDays: '3-5 days' },
  { state: 'Chhattisgarh', charge: 80, estimatedDays: '3-5 days' },
  { state: 'Goa', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Gujarat', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Haryana', charge: 50, estimatedDays: '2-3 days' },
  { state: 'Himachal Pradesh', charge: 80, estimatedDays: '3-5 days' },
  { state: 'Jharkhand', charge: 80, estimatedDays: '3-5 days' },
  { state: 'Karnataka', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Kerala', charge: 70, estimatedDays: '3-5 days' },
  { state: 'Madhya Pradesh', charge: 70, estimatedDays: '3-5 days' },
  { state: 'Maharashtra', charge: 50, estimatedDays: '2-3 days' },
  { state: 'Manipur', charge: 150, estimatedDays: '5-8 days' },
  { state: 'Meghalaya', charge: 140, estimatedDays: '5-8 days' },
  { state: 'Mizoram', charge: 150, estimatedDays: '5-8 days' },
  { state: 'Nagaland', charge: 150, estimatedDays: '5-8 days' },
  { state: 'Odisha', charge: 80, estimatedDays: '3-5 days' },
  { state: 'Punjab', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Rajasthan', charge: 70, estimatedDays: '3-5 days' },
  { state: 'Sikkim', charge: 140, estimatedDays: '5-8 days' },
  { state: 'Tamil Nadu', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Telangana', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Tripura', charge: 140, estimatedDays: '5-8 days' },
  { state: 'Uttar Pradesh', charge: 60, estimatedDays: '2-4 days' },
  { state: 'Uttarakhand', charge: 80, estimatedDays: '3-5 days' },
  { state: 'West Bengal', charge: 70, estimatedDays: '3-5 days' },
  // 8 Union Territories
  { state: 'Andaman and Nicobar Islands', charge: 200, estimatedDays: '7-10 days' },
  { state: 'Chandigarh', charge: 50, estimatedDays: '2-3 days' },
  { state: 'Dadra and Nagar Haveli and Daman and Diu', charge: 80, estimatedDays: '3-5 days' },
  { state: 'Delhi', charge: 0, estimatedDays: '1-2 days' },
  { state: 'Jammu and Kashmir', charge: 100, estimatedDays: '4-7 days' },
  { state: 'Ladakh', charge: 200, estimatedDays: '7-10 days' },
  { state: 'Lakshadweep', charge: 250, estimatedDays: '7-12 days' },
  { state: 'Puducherry', charge: 70, estimatedDays: '3-5 days' },
];

const DEFAULT_CONFIG: ShippingConfig = {
  gstRate: 5,
  freeShippingThreshold: 5000,
  stateRates: ALL_STATES_AND_UTS,
};

export function getShippingConfig(): ShippingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so new fields are never missing
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        stateRates: parsed.stateRates && parsed.stateRates.length > 0
          ? parsed.stateRates
          : DEFAULT_CONFIG.stateRates,
      };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_CONFIG };
}

export function saveShippingConfig(config: ShippingConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Trigger cross-tab update
  localStorage.setItem('testone_shipping_updated', Date.now().toString());
}

export function getGstRate(): number {
  return getShippingConfig().gstRate;
}

export function getFreeShippingThreshold(): number {
  return getShippingConfig().freeShippingThreshold;
}

export function getDeliveryChargeForState(state: string): { charge: number; estimatedDays: string } {
  const config = getShippingConfig();
  const rate = config.stateRates.find(
    r => r.state.toLowerCase() === state.toLowerCase()
  );
  if (rate) return { charge: rate.charge, estimatedDays: rate.estimatedDays };
  return { charge: 100, estimatedDays: '4-7 days' };
}
