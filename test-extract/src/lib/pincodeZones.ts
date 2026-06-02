import { getDeliveryChargeForState } from './shippingConfig';

// Indian pincode zone mapping for delivery charges
// Pincode ranges: first 1-2 digits determine the zone/state

export interface DeliveryInfo {
  zone: 'metro' | 'tier2' | 'rest';
  city: string;
  state: string;
  deliveryCharge: number;
  estimatedDays: string;
  available: boolean;
}

// Metro city pincodes (FREE delivery)
const METRO_RANGES: { prefix: string; city: string; state: string }[] = [
  // Mumbai
  { prefix: '400', city: 'Mumbai', state: 'Maharashtra' },
  { prefix: '410', city: 'Mumbai', state: 'Maharashtra' },
  // Delhi NCR
  { prefix: '110', city: 'Delhi', state: 'Delhi' },
  { prefix: '120', city: 'Gurgaon', state: 'Haryana' },
  { prefix: '121', city: 'Faridabad', state: 'Haryana' },
  { prefix: '122', city: 'Gurgaon', state: 'Haryana' },
  { prefix: '201', city: 'Noida', state: 'Uttar Pradesh' },
  { prefix: '202', city: 'Greater Noida', state: 'Uttar Pradesh' },
  // Bangalore
  { prefix: '560', city: 'Bangalore', state: 'Karnataka' },
  // Chennai
  { prefix: '600', city: 'Chennai', state: 'Tamil Nadu' },
  // Kolkata
  { prefix: '700', city: 'Kolkata', state: 'West Bengal' },
  // Hyderabad
  { prefix: '500', city: 'Hyderabad', state: 'Telangana' },
  // Pune
  { prefix: '411', city: 'Pune', state: 'Maharashtra' },
  { prefix: '412', city: 'Pune', state: 'Maharashtra' },
  // Ahmedabad
  { prefix: '380', city: 'Ahmedabad', state: 'Gujarat' },
];

// Tier-2 city pincodes (₹50 delivery)
const TIER2_RANGES: { prefix: string; city: string; state: string }[] = [
  { prefix: '302', city: 'Jaipur', state: 'Rajasthan' },
  { prefix: '226', city: 'Lucknow', state: 'Uttar Pradesh' },
  { prefix: '440', city: 'Nagpur', state: 'Maharashtra' },
  { prefix: '462', city: 'Bhopal', state: 'Madhya Pradesh' },
  { prefix: '382', city: 'Gandhinagar', state: 'Gujarat' },
  { prefix: '360', city: 'Rajkot', state: 'Gujarat' },
  { prefix: '395', city: 'Surat', state: 'Gujarat' },
  { prefix: '390', city: 'Vadodara', state: 'Gujarat' },
  { prefix: '452', city: 'Indore', state: 'Madhya Pradesh' },
  { prefix: '482', city: 'Jabalpur', state: 'Madhya Pradesh' },
  { prefix: '160', city: 'Chandigarh', state: 'Chandigarh' },
  { prefix: '141', city: 'Ludhiana', state: 'Punjab' },
  { prefix: '144', city: 'Jalandhar', state: 'Punjab' },
  { prefix: '143', city: 'Amritsar', state: 'Punjab' },
  { prefix: '208', city: 'Kanpur', state: 'Uttar Pradesh' },
  { prefix: '211', city: 'Prayagraj', state: 'Uttar Pradesh' },
  { prefix: '221', city: 'Varanasi', state: 'Uttar Pradesh' },
  { prefix: '250', city: 'Meerut', state: 'Uttar Pradesh' },
  { prefix: '248', city: 'Dehradun', state: 'Uttarakhand' },
  { prefix: '800', city: 'Patna', state: 'Bihar' },
  { prefix: '751', city: 'Bhubaneswar', state: 'Odisha' },
  { prefix: '781', city: 'Guwahati', state: 'Assam' },
  { prefix: '431', city: 'Aurangabad', state: 'Maharashtra' },
  { prefix: '422', city: 'Nashik', state: 'Maharashtra' },
  { prefix: '530', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { prefix: '520', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { prefix: '570', city: 'Mysore', state: 'Karnataka' },
  { prefix: '580', city: 'Hubli', state: 'Karnataka' },
  { prefix: '590', city: 'Belgaum', state: 'Karnataka' },
  { prefix: '641', city: 'Coimbatore', state: 'Tamil Nadu' },
  { prefix: '625', city: 'Madurai', state: 'Tamil Nadu' },
  { prefix: '620', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { prefix: '682', city: 'Kochi', state: 'Kerala' },
  { prefix: '695', city: 'Thiruvananthapuram', state: 'Kerala' },
  { prefix: '180', city: 'Jammu', state: 'Jammu & Kashmir' },
];

// State mapping by first 1-2 digits
const STATE_BY_PREFIX: Record<string, string> = {
  '1': 'North India',
  '2': 'Uttar Pradesh / Uttarakhand',
  '3': 'Rajasthan / Gujarat',
  '4': 'Maharashtra / Goa',
  '5': 'Andhra Pradesh / Telangana / Karnataka',
  '6': 'Tamil Nadu / Kerala',
  '7': 'West Bengal / Odisha / NE India',
  '8': 'Bihar / Jharkhand',
  '9': 'Army Post Office',
};

export function checkPincode(pincode: string): DeliveryInfo | null {
  // Validate pincode format (6 digits, starts with 1-9)
  if (!/^[1-9]\d{5}$/.test(pincode)) return null;

  const p3 = pincode.substring(0, 3);
  const p2 = pincode.substring(0, 2);

  // Check metro
  const metro = METRO_RANGES.find(m => pincode.startsWith(m.prefix));
  if (metro) {
    const dynamic = getDeliveryChargeForState(metro.state);
    return {
      zone: 'metro',
      city: metro.city,
      state: metro.state,
      deliveryCharge: dynamic.charge,
      estimatedDays: dynamic.estimatedDays,
      available: true,
    };
  }

  // Check tier-2
  const tier2 = TIER2_RANGES.find(t => pincode.startsWith(t.prefix));
  if (tier2) {
    const dynamic = getDeliveryChargeForState(tier2.state);
    return {
      zone: 'tier2',
      city: tier2.city,
      state: tier2.state,
      deliveryCharge: dynamic.charge,
      estimatedDays: dynamic.estimatedDays,
      available: true,
    };
  }

  // Rest of India
  const stateGuess = STATE_BY_PREFIX[pincode[0]] || 'India';
  const dynamic = getDeliveryChargeForState(stateGuess);
  return {
    zone: 'rest',
    city: '',
    state: stateGuess,
    deliveryCharge: dynamic.charge,
    estimatedDays: dynamic.estimatedDays,
    available: true,
  };
}
