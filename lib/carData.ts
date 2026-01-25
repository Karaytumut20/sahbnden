// Türkiye pazarındaki en popüler araçların hiyerarşik verisi
// Yapı: Marka -> Seri -> Model (Motor/Paket)

export const carHierarchy: Record<string, Record<string, string[]>> = {
  "BMW": {
    "1 Serisi": ["116d", "116i", "118d", "118i", "120d", "120i", "128ti", "M135i xDrive"],
    "2 Serisi": ["216d Active Tourer", "216d Gran Coupe", "218i Gran Coupe", "218i Cabrio", "220d Coupe"],
    "3 Serisi": ["316i", "318d", "318i", "320d", "320d xDrive", "320i", "320i ED", "325i", "328i", "330e", "330i", "M3", "M340i xDrive"],
    "4 Serisi": ["418d Gran Coupe", "418i Gran Coupe", "420d", "420d Gran Coupe", "420d xDrive", "428i", "430i", "M4"],
    "5 Serisi": ["520d", "520d xDrive", "520i", "523i", "525d xDrive", "528i xDrive", "530d xDrive", "530e xDrive", "530i xDrive", "M5"],
    "X1": ["sDrive16d", "sDrive18i", "xDrive20d"],
    "X3": ["sDrive16d", "sDrive18i", "xDrive20d", "sDrive20i"],
    "X5": ["xDrive25d", "xDrive30d", "xDrive40e", "xDrive45e"],
    "i Serisi": ["i3", "i4", "i4 M50", "i5", "i7", "iX", "iX1", "iX3"]
  },
  "Mercedes-Benz": {
    "A Serisi": ["A 180", "A 180 d", "A 180 CDI", "A 200", "A 200 AMG", "A 45 AMG"],
    "B Serisi": ["B 180", "B 180 d", "B 180 CDI", "B 200"],
    "C Serisi": ["C 180", "C 180 AMG", "C 200", "C 200 d", "C 200 4MATIC", "C 220 d", "C 250", "C 63 AMG"],
    "E Serisi": ["E 180", "E 200", "E 200 d", "E 220 d", "E 250", "E 250 CDI", "E 300", "E 350"],
    "S Serisi": ["S 320", "S 350 d 4MATIC", "S 400 d 4MATIC", "S 500", "S 580 4MATIC"],
    "CLA": ["CLA 180 d", "CLA 200", "CLA 200 AMG", "CLA 45 AMG"],
    "GLA": ["GLA 180 d", "GLA 200"],
    "GLC": ["GLC 250 4MATIC", "GLC 220 d 4MATIC"],
    "EQ Serisi (Elektrik)": ["EQA 250", "EQB 250", "EQC 400", "EQE 300", "EQE 350", "EQS 580"]
  },
  "Audi": {
    "A3": ["A3 Sedan 30 TFSI", "A3 Sedan 35 TFSI", "A3 Sportback 30 TDI", "A3 Sportback 35 TFSI", "1.6 TDI Attraction", "1.6 TDI Ambition"],
    "A4": ["A4 Sedan 40 TDI", "A4 Sedan 45 TFSI quattro", "2.0 TDI", "1.4 TFSI", "2.0 TFSI quattro"],
    "A5": ["A5 Sportback 40 TDI quattro", "A5 Sportback 45 TFSI quattro", "A5 Coupe"],
    "A6": ["A6 Sedan 40 TDI quattro", "A6 Sedan 45 TFSI quattro", "A6 Sedan 50 TDI quattro", "2.0 TDI"],
    "Q2": ["30 TDI", "35 TFSI", "1.6 TDI"],
    "Q3": ["35 TFSI", "1.4 TFSI"],
    "Q5": ["40 TDI quattro", "2.0 TDI quattro"],
    "Q7": ["50 TDI quattro", "3.0 TDI quattro"],
    "Q8": ["50 TDI quattro", "55 TFSI quattro"]
  },
  "Volkswagen": {
    "Polo": ["1.0 Trendline", "1.0 TSI Life", "1.0 TSI Style", "1.2 TSI Comfortline", "1.4 TDI Comfortline", "1.6 TDI Comfortline", "GTI"],
    "Golf": ["1.0 TSI Midline Plus", "1.0 TSI Impression", "1.0 eTSI Life", "1.4 TSI Highline", "1.5 eTSI R-Line", "1.6 TDI Comfortline", "1.6 TDI Highline", "R", "GTI"],
    "Passat": ["1.4 TSI Comfortline", "1.4 TSI Highline", "1.4 TSI Trendline", "1.5 TSI Business", "1.5 TSI Elegance", "1.6 TDI Comfortline", "1.6 TDI Highline", "2.0 TDI Highline"],
    "Tiguan": ["1.5 TSI Life", "1.5 TSI Elegance", "1.5 TSI R-Line", "2.0 TDI"],
    "T-Roc": ["1.5 TSI Highline", "1.5 TSI R-Line"],
    "Taigo": ["1.0 TSI Life", "1.0 TSI Style", "1.5 TSI R-Line"],
    "Caddy": ["2.0 TDI Life", "2.0 TDI Style", "1.6 TDI"]
  },
  "Renault": {
    "Clio": ["1.0 SCe Joy", "1.0 TCe Joy", "1.0 TCe Touch", "1.2 Joy", "1.5 dCi Joy", "1.5 dCi Touch", "1.5 dCi Icon", "RS"],
    "Megane": ["1.3 TCe Joy", "1.3 TCe Touch", "1.3 TCe Icon", "1.5 dCi Joy", "1.5 dCi Touch", "1.5 dCi Icon", "1.6 Joy"],
    "Symbol": ["1.5 dCi Joy", "1.5 dCi Touch", "1.2 Joy"],
    "Taliant": ["1.0 Sce Joy", "1.0 Turbo X-Tronic Joy"],
    "Captur": ["1.0 TCe Touch", "1.2 Turbo Icon", "1.3 TCe Icon", "1.5 dCi Icon"],
    "Kadjar": ["1.5 dCi Icon", "1.5 dCi Touch", "1.3 TCe"],
    "Austral": ["1.3 TCe Techno Esprit Alpine"],
    "Zoe": ["Intens", "Zen"]
  },
  "Fiat": {
    "Egea": ["1.3 MultiJet Easy", "1.3 MultiJet Urban", "1.4 Fire Easy", "1.4 Fire Urban", "1.6 MultiJet Lounge", "1.6 MultiJet Urban", "Cross 1.4 Fire", "Cross 1.6 MultiJet"],
    "Linea": ["1.3 MultiJet Active", "1.3 MultiJet Pop", "1.4 Fire Active"],
    "Punto": ["1.3 MultiJet Pop", "1.4 Pop"],
    "500": ["1.2 Pop", "1.2 Lounge", "1.4 Lounge", "500e La Prima"],
    "500X": ["1.6 MultiJet Cross Plus", "1.4 MultiAir Cross Plus"],
    "Doblo": ["1.3 MultiJet Safeline", "1.6 MultiJet Premio"]
  },
  "Ford": {
    "Focus": ["1.5 TDCi Trend X", "1.5 TDCi Titanium", "1.6 TDCi Trend X", "1.6 Ti-VCT Trend X", "1.0 EcoBoost"],
    "Fiesta": ["1.4 TDCi Trend", "1.5 TDCi Titanium", "1.25 Trend", "1.0 EcoBoost"],
    "Mondeo": ["1.5 TDCi Titanium", "1.6 TDCi Titanium", "2.0 TDCi"],
    "Kuga": ["1.5 EcoBoost Titanium", "1.5 TDCi Titanium", "1.5 TDCi ST-Line"],
    "Puma": ["1.0 EcoBoost Style", "1.0 EcoBoost ST-Line"],
    "Ranger": ["1.5 EcoBlue", "2.0 EcoBlue"]
  },
  "Toyota": {
    "Corolla": ["1.5 Dream", "1.5 Flame", "1.5 Vision", "1.6 Life", "1.6 Touch", "1.6 Advance", "1.8 Hybrid Dream", "1.8 Hybrid Flame"],
    "Yaris": ["1.0 Vision", "1.5 Dream", "1.5 Flame", "1.5 Hybrid"],
    "C-HR": ["1.2 Turbo", "1.8 Hybrid"],
    "RAV4": ["1.8 Hybrid", "2.5 Hybrid"],
    "Auris": ["1.6 Advance", "1.33 Life", "1.8 Hybrid"],
    "Proace City": ["1.5 D Dream", "1.5 D Flame"]
  },
  "Honda": {
    "Civic": ["1.6 i-VTEC Eco Elegance", "1.6 i-VTEC Eco Executive", "1.5 VTEC Turbo", "1.6 i-DTEC"],
    "City": ["1.5 i-VTEC", "1.5 Executive"],
    "CR-V": ["1.5 VTEC Turbo", "1.6 i-DTEC", "2.0 i-MMD Hybrid"],
    "Jazz": ["1.3", "1.4", "1.5 Hybrid"],
    "HR-V": ["1.5 i-VTEC", "1.5 e:HEV Hybrid"]
  },
  "Hyundai": {
    "i20": ["1.4 MPI Jump", "1.4 MPI Style", "1.2 MPI", "1.0 T-GDI"],
    "i10": ["1.0 MPI", "1.2 MPI"],
    "Accent Blue": ["1.6 CRDI Mode", "1.6 CRDI Prime", "1.4 D-CVVT"],
    "Elantra": ["1.6 CRDI", "1.6 MPI"],
    "Tucson": ["1.6 T-GDI Elite", "1.6 T-GDI N-Line", "1.6 CRDI Elite"],
    "Bayon": ["1.4 MPI", "1.0 T-GDI"]
  }
};