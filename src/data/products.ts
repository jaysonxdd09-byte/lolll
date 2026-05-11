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
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Standard Surgical Scissors',
    price: 15.99,
    category: 'Instruments',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    description: 'Stainless steel surgical scissors, precision ground for clean cuts.',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Medical Grade Latex Gloves',
    price: 12.50,
    category: 'Surgical Wear',
    image: '/images/gloves.png',
    description: 'Powder-free latex gloves, superior grip and tactile sensitivity.',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Disposable Face Masks (50 Pack)',
    price: 8.99,
    category: 'Surgical Wear',
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=400',
    description: '3-ply protective face masks with elastic earloops.',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Digital Blood Pressure Monitor',
    price: 45.00,
    category: 'Diagnostic',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=400',
    description: 'Automatic upper arm blood pressure monitor with large LCD display.',
    rating: 4.9
  },
  {
    id: '5',
    name: 'Wound Care Dressing Kit',
    price: 22.00,
    category: 'Wound Care',
    image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=400',
    description: 'Complete sterile dressing kit for minor surgical wounds.',
    rating: 4.6
  },
  {
    id: '6',
    name: 'Sterile Gauze Pads (100pcs)',
    price: 10.25,
    category: 'Wound Care',
    image: '/images/gauze.png',
    description: 'Highly absorbent sterile cotton gauze pads.',
    rating: 4.4
  },
  {
    id: '7',
    name: 'Pulse Oximeter',
    price: 34.00,
    category: 'Diagnostic',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    description: 'Fingertip pulse oximeter for oxygen saturation monitoring.',
    rating: 4.8
  },
  {
    id: '8',
    name: 'Infrared Thermometer',
    price: 29.50,
    category: 'Diagnostic',
    image: '/images/thermometer.png',
    description: 'Non-contact infrared forehead thermometer.',
    rating: 4.7
  },
  {
    id: '9',
    name: 'Glucometer Kit',
    price: 39.00,
    category: 'Diagnostic',
    image: '/images/glucometer.png',
    description: 'Blood glucose monitoring system with 50 test strips.',
    rating: 4.9
  },
  {
    id: '10',
    name: 'Surgical Scalpel No. 3',
    price: 12.00,
    category: 'Instruments',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    description: 'Precision scalpel handle with stainless steel grip.',
    rating: 4.8
  },
  {
    id: '12',
    name: 'Foley Catheter (10 Pack)',
    price: 85.00,
    category: 'Catheters & Drainages',
    image: 'https://images.unsplash.com/photo-1579154236598-c64e6d408b63?auto=format&fit=crop&q=80&w=400',
    description: 'Sterile 2-way foley catheter, latex free silicone coated.',
    rating: 4.6
  },
  {
    id: '13',
    name: 'Knee Support Brace',
    price: 24.50,
    category: 'Orthopaedic Products',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'Neoprene adjustable knee support for joint stability.',
    rating: 4.7
  },
  {
    id: '14',
    name: 'Ostomy Pouch Set',
    price: 32.00,
    category: 'Ostomy Care',
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=400',
    description: 'Drainable ostomy pouch with skin barrier and high security seal.',
    rating: 4.5
  },
  {
    id: '15',
    name: 'Surgical Gauze Swabs',
    price: 15.00,
    category: 'Surgical Supplies',
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a4e?auto=format&fit=crop&q=80&w=400',
    description: 'Highly absorbent cotton gauze swabs for surgical procedures.',
    rating: 4.6
  },
  {
    id: '16',
    name: 'Insulin Syringes (100 Pack)',
    price: 12.99,
    category: 'Syringes & Needles',
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a4e?auto=format&fit=crop&q=80&w=400',
    description: 'Ultra-fine insulin syringes with attached needles, 1ml capacity.',
    rating: 4.8
  },
  {
    id: '17',
    name: 'Hydrocolloid Dressing',
    price: 18.25,
    category: 'Wound Care',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=400',
    description: 'Self-adhesive hydrocolloid dressing for rapid wound healing.',
    rating: 4.7
  },
  {
    id: '18',
    name: 'Elite Cardio Monitor',
    price: 1250.00,
    category: 'Diagnostic',
    image: 'https://images.unsplash.com/photo-1579154391796-52c67cf8dcbc?auto=format&fit=crop&q=80&w=400',
    description: 'Advanced portable 12-lead ECG monitor for clinical use.',
    rating: 5.0
  },
  {
    id: '19',
    name: 'Retraction System',
    price: 450.00,
    category: 'Instruments',
    image: 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=400',
    description: 'Self-retaining abdominal retractor set with multiple blades.',
    rating: 4.9
  },
  {
    id: '20',
    name: 'Sterile Operating Gown',
    price: 45.00,
    category: 'Surgical Wear',
    image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400',
    description: 'AAMI Level 4 reinforced sterile isolation gown.',
    rating: 4.8
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
