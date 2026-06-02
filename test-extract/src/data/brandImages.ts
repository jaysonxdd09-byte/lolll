// Brand logo/image URLs - using reliable placeholder images that represent each brand
export const brandImages: Record<string, string> = {
  '3M': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/3M_logo.svg/1200px-3M_logo.svg.png',
  'Smith & Nephew': 'https://www.smith-nephew.com/images/logo.png',
  'Surgiwear': 'https://www.surgiwear.com/images/logo.png',
  'BSN Essity': 'https://www.essity.com/images/logo.png',
  'Paramount': 'https://www.paramountmedical.com/images/logo.png',
  'Ess Kae Medicure': 'https://via.placeholder.com/200x100/4B0082/FFFFFF?text=Ess+Kae',
  'Sanvin Care': 'https://via.placeholder.com/200x100/008080/FFFFFF?text=Sanvin+Care',
  'Test One': 'https://via.placeholder.com/200x100/002970/FFFFFF?text=Test+One',
  'testone': 'https://via.placeholder.com/200x100/002970/FFFFFF?text=TestOne',
};

// Default brand image if not found
export const defaultBrandImage = 'https://via.placeholder.com/200x100/666666/FFFFFF?text=Brand';

// Get brand image URL
export function getBrandImage(brandName: string): string {
  return brandImages[brandName] || defaultBrandImage;
}
