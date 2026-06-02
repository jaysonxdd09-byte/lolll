import { db } from './dbClient';

// The CSV data from Sheet4.csv
const csvData = `,"                                  3M INDIA 
",,,,,,,,,,,,,,,,,,,,,,,
,S.NO,"PRODUCT NAME ","paking roll",MRP,"RATE ",,,,,,,,,,,,,,,,,,,,
,1,"tegaderm 1610","100pcs/ box,4box/case",21250,,,,,,,,,,,,,,,,,,,,,
,2,"tegaderm 1623","100pcs/ box,4box/case",12750,,,,,,,,,,,,,,,,,,,,,
,3,"tegaderm 1633","100pcs/ box,4box/case",22000,,,,,,,,,,,,,,,,,,,,,
,4,"tegaderm 1635","50pcs/ box,4box/case",41250,,,,,,,,,,,,,,,,,,,,,
,5,"tegaderm 1657r , ","25pcs/box,4box/case",,,,,,,,,,,,,,,,,,,,,,
6,,"tegaderm 1660r","25pcs/box,4box/case",39500,,,,,,,,,,,,,,,,,,,,,
,7,"tegaderm 8526","50pcs/ box,4box/case",14950,,,,,,,,,,,,,,,,,,,,,
,8,"tegaderm 8589","25pcs/box,6box/case",16250,,,,,,,,,,,,,,,,,,,,,
,9,"tegaderm 8590","25pcs/box,6box/case",18950,,,,,,,,,,,,,,,,,,,,,
,10,"tegaderm 8591","25pcs/box,6box/case",21725,,,,,,,,,,,,,,,,,,,,,
,11,"tegaderm 8582","50pcs/box,6box/case",9350,,,,,,,,,,,,,,,,,,,,,
,12,"cavilon 28ml ","12bottle/box,6box ",18696,,,,,,,,,,,,,,,,,,,,,
,13,"3m elastic adhesive  bandage 4mtr*10cm  (EAB)","30 pcs/case",1780,,,,,,,,,,,,,,,,,,,,,
,14,"3M ECG electrod oval ","100pcs/box,10pack/case",3450,,,,,,,,,,,,,,,,,,,,,
,15,"3m skin prep 7.5%(100ml/500ml)",,,,,,,,,,,,,,,,,,,,,,,
,16,"3m skin prep pvb scurb 10%(100ml/500ml)",60bt/case,93PCS,,,,,,,,,,,,,,,,,,,,,
,17,"3m skin prepping chg 2%  100ml /500ml","24bt/case ",400,,,,,,,,,,,,,,,,,,,,,
,18,"3m  chg scurb 4 % 100ml /500ml ","60 bt/case",365,,,,,,,,,,,,,,,,,,,,,
,19,"3m avagard  handrub blue 100ml/500ml ","24bt/case ",536,,,,,,,,,,,,,,,,,,,,,
,20,"3m chg  avagurd handrub pink 100ml /500ml","24bt/case ",1080,,,,,,,,,,,,,,,,,,,,,
,21,"3m   chg avagurd  handrub pink with pump 100ml  ",60bt/case,285,,,,,,,,,,,,,,,,,,,,,
,22,"6650 ioban (antimicrobial incise drape)","10pcs/box,4box/case",20300,,,,,,,,,,,,,,,,,,,,,
,23," 6640 ioban(antimicrobial incise drape)","10pcs/box,4box/case",15600,,,,,,,,,,,,,,,,,,,,,
,24,"3m micropore 1 inch 9mtr (10 yards)","12pcs/box,30pack/case",1620,,,,,,,,,,,,,,,,,,,,,
,25,"3m micropore 2 inch 9mtr (10 yards)","6pcs/box,30pack/case",1620,,,,,,,,,,,,,,,,,,,,,
,26,"3m micropore 3 inch 9mtr (10 yards)","4pcs/box,30pack/case",1620,,,,,,,,,,,,,,,,,,,,,
,27,"3m durapore 1 inch 9mtr (10 yards)","12pcs/box,30pack/case",9492,,,,,,,,,,,,,,,,,,,,,
,28,"3m durapore 2 inch 9mtr (10 yards)","6pcs/box,30pack/case",9498,,,,,,,,,,,,,,,,,,,,,
,29,"3m durapore 3 inch 9mtr (10 yards)","4pcs/box,30pack/case",9500,,,,,,,,,,,,,,,,,,,,,
,30,"transpore 1 inch 9mtr (10 yards)","12pcs/box,30pack/case",2556,,,,,,,,,,,,,,,,,,,,,
,31,"transpore 2 inch 9mtr (10 yards)","6pcs/box,30pack/case",2559,,,,,,,,,,,,,,,,,,,,,
,32,"transpore 3inch 9mtr (10 yards)","4pcs/box,30pack/case",2568,,,,,,,,,,,,,,,,,,,,,
,33,"3m clliper blade ","50pcs/box ",46500,,,,,,,,,,,,,,,,,,,,,
,34,"3m multi enzyme (rapid)","12bottle/box ",3450,,,,,,,,,,,,,,,,,,,,,
,35,"3m littmann stethoscope ",,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,"      #SMITH & NEPHEW #  
",,,,,,,,,,,,,,,,,,,,,,,
,36,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,37,"Primapore 15*8 ",20pcs/box,2196,,,,,,,,,,,,,,,,,,,,,
,38,"primapore 10cm*8 ",20pcs/box,1903,,,,,,,,,,,,,,,,,,,,,
,39,"primapore 20*10 ",20pcs/box,2894,,,,,,,,,,,,,,,,,,,,,
,40,"proimapore 25*10",20pcs/box,3354,,,,,,,,,,,,,,,,,,,,,
,41,"primapore 30*10",20pcs/box,4232,,,,,,,,,,,,,,,,,,,,,
,42,"primapore 35*10",20pcs/box,,,,,,,,,,,,,,,,,,,,,,
,43,"Bactigras 10*10",10pcs/box,351,,,,,,,,,,,,,,,,,,,,,
,44,"Bactigras 10*30",10pcs/box,65,,,,,,,,,,,,,,,,,,,,,
,45,"Bactigras roll",50roll/box,3338,,,,,,,,,,,,,,,,,,,,,
,46,"jelonet 10*10",10pcs/box,109,,,,,,,,,,,,,,,,,,,,,
,47,"jelonet 10*30",10pcs/box,59,,,,,,,,,,,,,,,,,,,,,
,48,"jelonet tin 10*10 ",10pcs/box,272,,,,,,,,,,,,,,,,,,,,,
,49,"opsite incise 15*28cm",10pcs/box,2262,,,,,,,,,,,,,,,,,,,,,
,50,"opsite incise 30*28cm ",10pcs/box,3499,,,,,,,,,,,,,,,,,,,,,
,51,"opsite incise 45*28cm",10pcs/box,6481,,,,,,,,,,,,,,,,,,,,,
,52,"opsite incise 45*55cm ",10pcs/box,10581,,,,,,,,,,,,,,,,,,,,,
,53,"opsite post op 6.5*5",100pcs/box,10248,,,,,,,,,,,,,,,,,,,,,
,54,"opsite post op 9.5*8.5 ",20pcs/box,3806,,,,,,,,,,,,,,,,,,,,,
,55,"opsite post op 15.5*8.5",20pcs/box,5696,,,,,,,,,,,,,,,,,,,,,
,56,"opsite post op 20*10 ",20pcs/box,7027,,,,,,,,,,,,,,,,,,,,,
,57,"opsite post op 25*10 ",20pcs/box,7613,,,,,,,,,,,,,,,,,,,,,
,58,"opsite post op 30*10",20pcs/box,9050,,,,,,,,,,,,,,,,,,,,,
,59,"opsirte post op 35*10 ",20pcs/box,10248,,,,,,,,,,,,,,,,,,,,,
,60,"IV3000 10*12 CM ",50pcs/box,8984,,,,,,,,,,,,,,,,,,,,,
,61,"IV 3000 7*9 CM ",100pcs/box,13552,,,,,,,,,,,,,,,,,,,,,
,62,"PRIMAPORE 6.5*8CM ",50pcs/box,4026,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,"        # SURGIWEAR #  
",,,,,,,,,,,,,,,,,,,,,,,
,,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,63,"surgiwear half gown D800",200pcs/case,68,,,,,,,,,,,,,,,,,,,,,
,64,"surgiwear full gown eco MAE85L ",200pcs/case,,,,,,,,,,,,,,,,,,,,,,
,65,"surguwear full gown eco MAE85 M ",200pcs/case,,,,,,,,,,,,,,,,,,,,,,
,66,"surgiwear knee o drape 505 ",10pcs/case,"                                                                                                                                                                                                                                                                                                                                                                                                                                                    ",,,,,,,,,,,,,,,,,,,,,
,67,"surgiwear knee o drape 515 ",10pcs/case,923,,,,,,,,,,,,,,,,,,,,,
,68,"surgiwear lamino-spinal drape E116 ",10pcs/case,886,,,,,,,,,,,,,,,,,,,,,
,69,"surgiwear O-scope drape D204l ",10pcs/case,1327,,,,,,,,,,,,,,,,,,,,,
,70,"surgiwear PCNL drape D903",10pcs/case,1645,,,,,,,,,,,,,,,,,,,,,
,71,"surgiwear PCNL drepe eco E913",10pcs/case,696,,,,,,,,,,,,,,,,,,,,,
,72,"surgiwear Turpe drape eco E517 ",10pcs/case,859,,,,,,,,,,,,,,,,,,,,,
,73,"surgiwear Io drape medium pram ID3O25-2F ",10pcs/case,635,,,,,,,,,,,,,,,,,,,,,
,74,"IO DRAPE LARGE ID3535-1",,240,,,,,,,,,,,,,,,,,,,,,
,75,"IO DRAPE SMALL ID1020 ",,96,,,,,,,,,,,,,,,,,,,,,
,76,"HIP U DRAPE ECO 511",10pcs/case,923,,,,,,,,,,,,,,,,,,,,,
,77,"Craniotomy drape eco E911",10pcs/case,2149,,,,,,,,,,,,,,,,,,,,,
,78,"clling drape CD01 ",100pcs/case,62,,,,,,,,,,,,,,,,,,,,,
,79,"eye drape E710",,57,,,,,,,,,,,,,,,,,,,,,
,80,"eye wipe EW01 ",,,,,,,,,,,,,,,,,,,,,,,
,81,"Plain sheets ",100pcs/case,,,,,,,,,,,,,,,,,,,,,,
,82,"Darmi marker ",10pcs/pack,,,,,,,,,,,,,,,,,,,,,
,83,"G dress comfy 05",50pcs/pack,375,,,,,,,,,,,,,,,,,,,,,
,84,"G dress comfy 10 ",10pcs/pack,258,,,,,,,,,,,,,,,,,,,,,
,85,"G dress comfy 15",10pc/pack,364,,,,,,,,,,,,,,,,,,,,,
,86,"G dress comfy 20",10pcs/pack,749,,,,,,,,,,,,,,,,,,,,,
,87,"G dress comfy 25",10pcs/pack,968,,,,,,,,,,,,,,,,,,,,,
,88,"G dress comfy 30",10pcs/pack,1071,,,,,,,,,,,,,,,,,,,,,
,89,"G dress swim proof 05",50pcs/pack,375,," ",,,,,,,,,,,,,,,,,,,
,90,"G dress swim  proof 10",10pcs/pack,258,,,,,,,,,,,,,,,,,,,,,
,91,"G dress  swim  proof 15",10pcs/pack,364,,,,,,,,,,,,,,,,,,,,,
,92,"G dressswim proof 20",10pcs/pack,749,,,,,,,,,,,,,,,,,,,,,
,93,"G dressswim proof 25",10pcs/pack,968,,,,,,,,,,,,,,,,,,,,,
,94,"G dress swim proof 30",10pcs/pack,1071,,,,,,,,,,,,,,,,,,,,,
,95,"VP High Pressure SH201",,6595,,,,,,,,,,,,,,,,,,,,,
,96,"VP MediumPressure SH202",,6595,,,,,,,,,,,,,,,,,,,,,
,97,"VP Low Pressure SH203",,6595,,,,,,,,,,,,,,,,,,,,,
,98,"CEFLUI Ventricular External Drainage Kit SH034",1pcs/pack,3444,,,,,,,,,,,,,,,,,,,,,
,99,"Lumbar External Drainage system SH025",1pcs/pack,3258,,,,,,,,,,,,,,,,,,,,,
,100,"Ventricular External Drainage system SH024",1pcs/pack,2899,,,,,,,,,,,,,,,,,,,,,
,101,"G PATCH -GP01",1pcs/pack,2089,,,,,,,,,,,,,,,,,,,,,
,102,"G PATCH -GP02",1pcs/pack,2925,,,,,,,,,,,,,,,,,,,,,
,103,"G PATCH -GP03",1pcs/pack,4178,,,,,,,,,,,,,,,,,,,,,
,104,"G- BONE MHAB1",1pcs/pack,3990,,,,,,,,,,,,,,,,,,,,,
,105,"G- BONE MHAB2",1pcs/pack,3990,,,,,,,,,,,,,,,,,,,,,
,106,"G- BONE MHAB3",1pcs/pack,3990,,,,,,,,,,,,,,,,,,,,,
,107,"G- BONE MHAG1 ",,3419,,,,,,,,,,,,,,,,,,,,,
,108,"G-KIT PREMIUM  (HIV) K004P","10pcs /case",1176,,,,,,,,,,,,,,,,,,,,,
,109,"C-arm Cover D306-2",,347,,,,,,,,,,,,,,,,,,,,,
,110,"Cemera -cover D904(Simpsert)",,253,253,,,,,,,,,,,,,,,,,,,,
,,"Arthoscopy drape ECO E518",,1333,,,,,,,,,,,,,,,,,,,,,
,,"   # BSN ESSITY #  ",,,,,,,,,,,,,,,,,,,,,,,
,,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,111,"Fixomull stretch 10*10 ","24pcs/case ,",1702,,,,,,,,,,,,,,,,,,,,,
,112,"Fixomull stretch 10*2mtr","24pcs/case ,",482,,,,,,,,,,,,,,,,,,,,,
,113,"Fixomull transparent 10*10mtr","24pcs/case ,",4195,,,,,,,,,,,,,,,,,,,,,
,114,"Fixomull transparent 10*2mtr","24pcs/case ,",1252,,,,,,,,,,,,,,,,,,,,,
,115,"Elastomull 4 inch","20pcs/box,24box/case",65,,,,,,,,,,,,,,,,,,,,,
,116,"Elastomull 6 inch ","20pcs/box,24box/case",96,,,,,,,,,,,,,,,,,,,,,
,117,"Leucoband  ",30pcs/case,1751,,,,,,,,,,,,,,,,,,,,,
,118,"Gypsona 4 inch ","12pcs/box,",2948,,,,,,,,,,,,,,,,,,,,,
,119,"Gypsona 6 inch ","12pcs/box,",3589,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,"      #  Paramount #",,,,,,,,,,,,,,,,,,,,,,,
,,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,120,"skin grafting blade ",10pcs/box,1400,,,,,,,,,,,,,,,,,,,,,
,121,"prep rezar with two side blades","50pcs/box,20box/case",45,,,,,,,,,,,,,,,,,,,,,
,122,"carbon steel surgical blade All size",100pcs/box,550,,,,,,,,,,,,,,,,,,,,,
,123,"underpad (60*90cm)","10pcs/pack,12pack/case",650,,,,,,,,,,,,,,,,,,,,,
,124,"pasent wipes ","48pcs/pkt/,48pkt/case",249,,,,,,,,,,,,,,,,,,,,,
,125,"Adult diaper Arokleen (M)","10pcs/pack,12pack/case",550,,,,,,,,,,,,,,,,,,,,,
,,"Adult diaper Arokleen (L)",,600,,,,,,,,,,,,,,,,,,,,,
,,"Adult diaper Arokleen (X-LARGE)",,650,,,,,,,,,,,,,,,,,,,,,
,," ",,,,,,,,,,,,,,,,,,,,,,,
,,"   #  ESS KAE MEDICURE #",,,,,,,,,,,,,,,,,,,,,,,
,126,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,127,"ESS KAE P-PORE TAPE ",,,,,,,,,,,,,,,,,,,,,,,
,128,"IV CANNULA FIXATOR (ESS-FIXO)",,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,"# Sanvin care pvt ltd #",,,,,,,,,,,,,,,,,,,,,,,
,128,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,129,"half gown ",,,,,,,,,,,,,,,,,,,,,,,
,130,"ful gown ",,,,,,,,,,,,,,,,,,,,,,,
,131,"preamium kit ",,,,,,,,,,,,,,,,,,,,,,,
,132,"palin sheet ",,,,,,,,,,,,,,,,,,,,,,,
,133,"arthoscopy ",,,,,,,,,,,,,,,,,,,,,,,
,134,"shoulder u drape ",,,,,,,,,,,,,,,,,,,,,,,
,135,"soulder arthoscopy drape ",,,,,,,,,,,,,,,,,,,,,,,
,136,"pcnl drape ",,,,,,,,,,,,,,,,,,,,,,,
,137,"craniotomy drape ",,,,,,,,,,,,,,,,,,,,,,,
,138,"eye drape ",,,,,,,,,,,,,,,,,,,,,,,
,139,"knee-o- drape ",,,,,,,,,,,,,,,,,,,,,,,
,140,"turpe drape ",,,,,,,,,,,,,,,,,,,,,,,
,141,"laproscopy drape ",,,,,,,,,,,,,,,,,,,,,,,
,142,"c-arm- cover drape ",,,,,,,,,,,,,,,,,,,,,,,
,143,"camera cover drape ",,,,,,,,,,,,,,,,,,,,,,,
,,"clling drape ",,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,S,,,,,,,,,,,,,,,,,,,,,
,,"# TEST ONE SOLUTION PVT LTD #",,,,,,,,,,,,,,,,,,,,,,,
,144,"PRODUCT NAME ",,,,,,,,,,,,,,,,,,,,,,,
,145,"surgiwear half gown D800",,,,,,,,,,,,,,,,,,,,,,,
,146,"surgiwear full gown eco MAE85L ",,,,,,,,,,,,,,,,,,,,,,,
,147,"surguwear full gown eco MAE85 M ",,,,,,,,,,,,,,,,,,,,,,,
,148,"surgiwear knee o drape 505 ",,,,,,,,,,,,,,,,,,,,,,,
,149,"surgiwear knee o drape 515 ",,,,,,,,,,,,,,,,,,,,,,,
,150,"surgiwear lamino-spinal drape E116 ",,,,,,,,,,,,,,,,,,,,,,,
,151,"surgiwear O-scope drape D204l ",,,,,,,,,,,,,,,,,,,,,,,
,152,"surgiwear PCNL drape D903",,,,,,,,,,,,,,,,,,,,,,,
,153,"surgiwear PCNL drepe eco E913",,,,,,,,,,,,,,,,,,,,,,,
,154,"surgiwear Turpe drape eco E517 ",,,,,,,,,,,,,,,,,,,,,,,
,155,"surgiwear Io drape medium pram ID3O25-2F ",,,,,,,,,,,,,,,,,,,,,,,
,156,"IO DRAPE LARGE ID3535-1",,,,,,,,,,,,,,,,,,,,,,,
,157,"IO DRAPE SMALL ID1020 ",,,,,,,,,,,,,,,,,,,,,,,
,158,"HIP U DRAPE ECO 511",,,,,,,,,,,,,,,,,,,,,,,
,159,"Craniotomy drape eco e911",,,,,,,,,,,,,,,,,,,,,,,
,160,"clling drape CD01 ",,,,,,,,,,,,,,,,,,,,,,,
,161,"eye drape ",,,,,,,,,,,,,,,,,,,,,,,
,162,"eye wipe EW01 ",,,,,,,,,,,,,,,,,,,,,,,
,163,"Plain sheets ",,,,,,,,,,,,,,,,,,,,,,,
,164,"Darmi marker ",,,,,,,,,,,,,,,,,,,,,,,
,165,"G PATCH -GP01",,,,,,,,,,,,,,,,,,,,,,,
,166,"G PATCH -GP02",,,,,,,,,,,,,,,,,,,,,,,
,167,"G PATCH -GP03",,,,,,,,,,,,,,,,,,,,,,,
,168,"G- BONE MHAB1",,,,,,,,,,,,,,,,,,,,,,,
,169,"G- BONE MHAB2",,,,,,,,,,,,,,,,,,,,,,,
,170,"G- BONE MHAB3",,,,,,,,,,,,,,,,,,,,,,,
,171,"G- BONE MHAG1 ",,,,,,,,,,,,,,,,,,,,,,,
,172,"G-KIT (HIV)",,,,,,,,,,,,,,,,,,,,,,,
,173,"C-arm drape ",,,,,,,,,,,,,,,,,,,,,,,
,,"Cemera -cover ",,,,,,,,,,,,,,,,,,,,,,,
,173,,,,,,,,,,,,,,,,,,,,,,,,
,174,"# ANSELL #  ( GOVT)",,,,,,,,,,,,,,,,,,,,,,,
,175,"# J&J # ",,,,,,,,,,,,,,,,,,,,,,,
,176,"# HEALTHIUM#",,,,,,,,,,,,,,,,,,,,,,,
,177,"# VIGGO #",,,,,,,,,,,,,,,,,,,,,,,
,178,"# HMD #",,,,,,,,,,,,,,,,,,,,,,,
,179,"# S. CURE #",,,,,,,,,,,,,,,,,,,,,,,
,180,"# MEDTECH  #",,,,,,,,,,,,,,,,,,,,,,,
,181,"# FILAMINGO # ",,,,,,,,,,,,,,,,,,,,,,,
,182,"# OPTIMA # ",,,,,,,,,,,,,,,,,,,,,,,
,,"# RAXON # ",,,,,,,,,,,,,,,,,,,,,,,
`;

interface CSVProduct {
  sno: string;
  name: string;
  packing: string;
  mrp: number;
  rate: number;
  brand: string;
}

// Parse the CSV content and extract products
function parseProductCSV(csvContent: string): CSVProduct[] {
  const lines = csvContent.split('\n');
  const products: CSVProduct[] = [];
  let currentBrand = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if this is a brand header line
    if (line.includes('#') || line.includes('3M INDIA') || line.includes('SMITH & NEPHEW') || 
        line.includes('SURGIWEAR') || line.includes('BSN ESSITY') || line.includes('Paramount') ||
        line.includes('ESS KAE MEDICURE') || line.includes('Sanvin care') || 
        line.includes('TEST ONE SOLUTION')) {
      // Extract brand name
      const brandMatch = line.match(/#?\s*([\w\s&\.]+)\s*#/);
      if (brandMatch) {
        currentBrand = brandMatch[1].trim();
      } else if (line.includes('3M INDIA')) {
        currentBrand = '3M';
      } else if (line.includes('SMITH & NEPHEW')) {
        currentBrand = 'Smith & Nephew';
      } else if (line.includes('SURGIWEAR')) {
        currentBrand = 'Surgiwear';
      } else if (line.includes('BSN ESSITY')) {
        currentBrand = 'BSN Essity';
      } else if (line.includes('Paramount')) {
        currentBrand = 'Paramount';
      } else if (line.includes('ESS KAE MEDICURE')) {
        currentBrand = 'Ess Kae Medicure';
      } else if (line.includes('Sanvin care')) {
        currentBrand = 'Sanvin Care';
      } else if (line.includes('TEST ONE SOLUTION')) {
        currentBrand = 'Test One';
      }
      continue;
    }
    
    // Skip header lines
    if (line.includes('PRODUCT NAME') || line.includes('S.NO')) continue;
    
    // Parse product data
    const cols = line.split(',');
    if (cols.length >= 3) {
      const sno = cols[1]?.trim() || '';
      const name = cols[2]?.trim().replace(/"/g, '') || '';
      const packing = cols[3]?.trim().replace(/"/g, '') || '';
      const mrp = parseFloat(cols[4]) || 0;
      const rate = parseFloat(cols[5]) || 0;
      
      if (name && name !== 'PRODUCT NAME' && currentBrand && mrp > 0) {
        products.push({
          sno,
          name,
          packing,
          mrp,
          rate,
          brand: currentBrand
        });
      }
    }
  }
  
  return products;
}

// Determine category based on product name
function getCategory(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('gown') || lowerName.includes('d800') || lowerName.includes('mae85')) {
    return 'Surgical Gown';
  }
  if (lowerName.includes('drape') || lowerName.includes('sheet')) {
    return 'Surgical Drape';
  }
  if (lowerName.includes('tape') || lowerName.includes('micropore') || lowerName.includes('durapore') || 
      lowerName.includes('transpore') || lowerName.includes('fixomull') || lowerName.includes('elastomull') ||
      lowerName.includes('leucoband') || lowerName.includes('gypsona') || lowerName.includes('primapore')) {
    return 'Surgical Tapes';
  }
  if (lowerName.includes('blade') || lowerName.includes('clipper')) {
    return 'Surgical Instruments';
  }
  if (lowerName.includes('diaper') || lowerName.includes('wipes') || lowerName.includes('underpad')) {
    return 'Patient Care';
  }
  if (lowerName.includes('stethoscope') || lowerName.includes('ecg')) {
    return 'Diagnostic';
  }
  if (lowerName.includes('handrub') || lowerName.includes('skin prep') || lowerName.includes('avagard') ||
      lowerName.includes('prep') || lowerName.includes('ioban')) {
    return 'Skin Preparation';
  }
  if (lowerName.includes('opsite') || lowerName.includes('tegaderm') || lowerName.includes('iv3000') ||
      lowerName.includes('bactigras') || lowerName.includes('jelonet') || lowerName.includes('cavilon')) {
    return 'Wound Care';
  }
  if (lowerName.includes('g dress') || lowerName.includes('g-patch') || lowerName.includes('g-bone')) {
    return 'Neurosurgery';
  }
  if (lowerName.includes('vp ') || lowerName.includes('drainage') || lowerName.includes('sh034') || 
      lowerName.includes('sh025') || lowerName.includes('sh024')) {
    return 'Neurosurgery';
  }
  if (lowerName.includes('cannula') || lowerName.includes('fixator')) {
    return 'IV Supplies';
  }
  if (lowerName.includes('marker')) {
    return 'Surgical Markers';
  }
  if (lowerName.includes('kit') || lowerName.includes('hiv')) {
    return 'Surgical Kits';
  }
  if (lowerName.includes('c-arm') || lowerName.includes('camera cover')) {
    return 'Equipment Covers';
  }
  
  return 'Medical Supplies';
}

// Generate a unique ID for the product
function generateProductId(brand: string, index: number): string {
  const brandPrefix = brand.substring(0, 3).toLowerCase().replace(/[^a-z]/g, '');
  return `${brandPrefix}${String(index).padStart(6, '0')}`;
}

// Get appropriate image URL based on product type
function getProductImage(name: string, brand: string): string {
  const lowerName = name.toLowerCase();
  
  // Map to relevant Unsplash images based on product type
  if (lowerName.includes('drape')) {
    return 'https://images.unsplash.com/photo-1584482968633-e39a2c2cd70b?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('gown')) {
    return 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('tape') || lowerName.includes('bandage')) {
    return 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('blade')) {
    return 'https://images.unsplash.com/photo-1584032791593-51833075d9fb?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('diaper') || lowerName.includes('wipes')) {
    return 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('stethoscope')) {
    return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('handrub') || lowerName.includes('prep') || lowerName.includes('sanitizer')) {
    return 'https://images.unsplash.com/photo-1588776814546-ec7e4d2c3a06?auto=format&fit=crop&q=80&w=400';
  }
  if (lowerName.includes('dressing') || lowerName.includes('wound') || lowerName.includes('opsite') || lowerName.includes('tegaderm')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400';
  }
  
  // Default images based on brand
  const brandImages: Record<string, string> = {
    '3M': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    'Smith & Nephew': 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=400',
    'Surgiwear': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
    'BSN Essity': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=400',
    'Paramount': 'https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=400',
    'Ess Kae Medicure': 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&q=80&w=400',
    'Sanvin Care': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    'Test One': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=400'
  };
  
  return brandImages[brand] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
}

// Execute the full import process
export async function executeFullImport(): Promise<{ 
  deleted: number; 
  imported: number; 
  failed: number;
  brands: string[];
}> {
  // Step 1: Delete all existing products
  let deleted = 0;
  try {
    const allProducts = await db.collection('products').getFullList();
    for (const product of allProducts) {
      try {
        await db.collection('products').delete(product.id);
        deleted++;
      } catch (e) {
        console.error('Failed to delete:', product.id);
      }
    }
  } catch (e) {
    console.error('Failed to fetch products for deletion:', e);
  }

  // Step 2: Parse CSV
  const products = parseProductCSV(csvData);
  const uniqueBrands = [...new Set(products.map(p => p.brand))];

  // Step 3: Import products
  let imported = 0;
  let failed = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    try {
      const id = generateProductId(product.brand, i + 1);
      const price = product.rate > 0 ? product.rate : (product.mrp > 0 ? Math.round(product.mrp * 0.7) : 100);
      
      await db.collection('products').create({
        id: id,
        name: product.name,
        price: price,
        mrp: product.mrp,
        category: getCategory(product.name),
        brand: product.brand,
        description: `${product.name} - ${product.packing || 'Medical grade product'}`,
        rating: 4.5,
        stock_quantity: 100,
        image: getProductImage(product.name, product.brand),
        code: product.sno || id,
        gst: '5%'
      });
      
      imported++;
    } catch (error) {
      console.error(`Failed to import: ${product.name}`, error);
      failed++;
    }
  }

  return { deleted, imported, failed, brands: uniqueBrands };
}
