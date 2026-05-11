export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  brand?: string;
  reviews?: number;
  stock_quantity: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Standard Surgical Scissors',
    price: 15.99,
    category: 'Instruments',
    image: '/images/surgical_scissors.png',
    description: 'Stainless steel surgical scissors, precision ground for clean cuts.',
    rating: 4.8,
    stock_quantity: 12
  },
  {
    id: '2',
    name: 'Medical Grade Latex Gloves',
    price: 12.50,
    category: 'Surgical Wear',
    image: '/images/gloves.png',
    description: 'Powder-free latex gloves, superior grip and tactile sensitivity.',
    rating: 4.5,
    stock_quantity: 0
  },
  {
    id: '3',
    name: 'Disposable Face Masks (50 Pack)',
    price: 8.99,
    category: 'Surgical Wear',
    image: '/images/disposable_masks.png',
    description: '3-ply protective face masks with elastic earloops.',
    rating: 4.7,
    stock_quantity: 45
  },
  {
    id: '4',
    name: 'Digital Blood Pressure Monitor',
    price: 45.00,
    category: 'Diagnostic',
    image: '/images/bp_monitor.png',
    description: 'Automatic upper arm blood pressure monitor with large LCD display.',
    rating: 4.9,
    stock_quantity: 8
  },
  {
    id: '5',
    name: 'Wound Care Dressing Kit',
    price: 22.00,
    category: 'Wound Care',
    image: '/images/wound_care_kit.png',
    description: 'Complete sterile dressing kit for minor surgical wounds.',
    rating: 4.6,
    stock_quantity: 15
  },
  {
    id: '6',
    name: 'Sterile Gauze Pads (100pcs)',
    price: 10.25,
    category: 'Wound Care',
    image: '/images/gauze.png',
    description: 'Highly absorbent sterile cotton gauze pads.',
    rating: 4.4,
    stock_quantity: 0
  },
  {
    id: '7',
    name: 'Pulse Oximeter',
    price: 34.00,
    category: 'Diagnostic',
    image: '/images/pulse_oximeter.png',
    description: 'Fingertip pulse oximeter for oxygen saturation monitoring.',
    rating: 4.8,
    stock_quantity: 20
  },
  {
    id: '8',
    name: 'Infrared Thermometer',
    price: 29.50,
    category: 'Diagnostic',
    image: '/images/thermometer.png',
    description: 'Non-contact infrared forehead thermometer.',
    rating: 4.7,
    stock_quantity: 10
  },
  {
    id: '9',
    name: 'Glucometer Kit',
    price: 39.00,
    category: 'Diagnostic',
    image: '/images/glucometer.png',
    description: 'Blood glucose monitoring system with 50 test strips.',
    rating: 4.9,
    stock_quantity: 5
  },
  {
    id: '10',
    name: 'Surgical Scalpel No. 3',
    price: 12.00,
    category: 'Instruments',
    image: '/images/surgical_scalpel.png',
    description: 'Precision scalpel handle with stainless steel grip.',
    rating: 4.8,
    stock_quantity: 18
  },
  {
    id: '12',
    name: 'Foley Catheter (10 Pack)',
    price: 85.00,
    category: 'Catheters & Drainages',
    image: '/images/foley_catheter.png',
    description: 'Sterile 2-way foley catheter, latex free silicone coated.',
    rating: 4.6,
    stock_quantity: 7
  },
  {
    id: '13',
    name: 'Knee Support Brace',
    price: 24.50,
    category: 'Orthopaedic Products',
    image: '/images/knee_brace.png',
    description: 'Neoprene adjustable knee support for joint stability.',
    rating: 4.7,
    stock_quantity: 25
  },
  {
    id: '14',
    name: 'Ostomy Pouch Set',
    price: 32.00,
    category: 'Ostomy Care',
    image: '/images/ostomy_pouch.png',
    description: 'Drainable ostomy pouch with skin barrier and high security seal.',
    rating: 4.5,
    stock_quantity: 12
  },
  {
    id: '15',
    name: 'Surgical Gauze Swabs',
    price: 15.00,
    category: 'Surgical Supplies',
    image: '/images/gauze_swabs.png',
    description: 'Highly absorbent cotton gauze swabs for surgical procedures.',
    rating: 4.6,
    stock_quantity: 0
  },
  {
    id: '16',
    name: 'Insulin Syringes (100 Pack)',
    price: 12.99,
    category: 'Syringes & Needles',
    image: '/images/insulin_syringes.png',
    description: 'Ultra-fine insulin syringes with attached needles, 1ml capacity.',
    rating: 4.8,
    stock_quantity: 50
  },
  {
    id: '17',
    name: 'Hydrocolloid Dressing',
    price: 18.25,
    category: 'Wound Care',
    image: '/images/hydrocolloid_dressing.png',
    description: 'Self-adhesive hydrocolloid dressing for rapid wound healing.',
    rating: 4.7,
    stock_quantity: 30
  },
  {
    id: '18',
    name: 'Elite Cardio Monitor',
    price: 1250.00,
    category: 'Diagnostic',
    image: 'https://images.unsplash.com/photo-1579154391796-52c67cf8dcbc?auto=format&fit=crop&q=80&w=400',
    description: 'Advanced portable 12-lead ECG monitor for clinical use.',
    rating: 5.0,
    stock_quantity: 3
  },
  {
    id: '19',
    name: 'Retraction System',
    price: 450.00,
    category: 'Instruments',
    image: 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=400',
    description: 'Self-retaining abdominal retractor set with multiple blades.',
    rating: 4.9,
    stock_quantity: 5
  },
  {
    id: '20',
    name: 'Sterile Operating Gown',
    price: 45.00,
    category: 'Surgical Wear',
    image: '/images/surgical_gown.png',
    description: 'AAMI Level 4 reinforced sterile isolation gown.',
    rating: 4.8,
    stock_quantity: 15
  }
];

export const categories = [
  'All',
  'Instruments',
  'Surgical Wear',
  'Diagnostic',
  'Wound Care',
  'Catheters & Drainages',
  'Syringes & Needles',
  'Orthopaedic Products',
  'Ostomy Care',
  'Surgical Supplies'
];
