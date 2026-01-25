// BU DOSYA TÜM KATEGORİ, MARKA VE MODEL HİYERARŞİSİNİ YÖNETİR
// Veritabanı yükünü azaltmak için statik veri seti kullanılır.

import {
  Home, Car, Monitor, ShoppingCart, Smartphone, Camera,
  Shirt, Watch, Baby, Gamepad2, BookOpen, Music, Dumbbell,
  Gem, Hammer, PenTool, Coffee
} from 'lucide-react';

// --- TİP TANIMLARI ---
export type CategoryNode = {
  id: string;
  title: string;
  slug: string;
  icon?: any;
  subs?: CategoryNode[];
  isDynamic?: boolean; // Eğer true ise, alt veriler dinamik bir listeden (araç/bilgisayar) gelir
  dynamicType?: 'car' | 'computer' | 'phone';
};

// --- ANA KATEGORİ AĞACI ---
export const categoryTree: CategoryNode[] = [
  {
    id: 'emlak', title: 'Emlak', icon: 'Home', slug: 'emlak',
    subs: [
      { id: 'konut', title: 'Konut', slug: 'konut', subs: [{ id: 'k-satilik', title: 'Satılık', slug: 'konut-satilik' }, { id: 'k-kiralik', title: 'Kiralık', slug: 'konut-kiralik' }] },
      { id: 'isyeri', title: 'İş Yeri', slug: 'isyeri', subs: [{ id: 'i-satilik', title: 'Satılık İş Yeri', slug: 'isyeri-satilik' }] },
      { id: 'arsa', title: 'Arsa', slug: 'arsa' }
    ]
  },
  {
    id: 'vasita', title: 'Vasıta', icon: 'Car', slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil', isDynamic: true, dynamicType: 'car' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup', isDynamic: true, dynamicType: 'car' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
      { id: 'ticari', title: 'Ticari Araçlar', slug: 'ticari-araclar' }
    ]
  },
  {
    id: 'alisveris', title: 'İkinci El ve Sıfır Alışveriş', icon: 'ShoppingCart', slug: 'alisveris',
    subs: [
      {
        id: 'bilgisayar', title: 'Bilgisayar', slug: 'bilgisayar',
        subs: [
            {
                id: 'dizustu', title: 'Dizüstü (Notebook)', slug: 'dizustu',
                subs: [
                    { id: 'laptop', title: 'Laptop', slug: 'laptop', isDynamic: true, dynamicType: 'computer' },
                    { id: 'notebook-yedek', title: 'Yedek Parça', slug: 'notebook-yedek' }
                ]
            },
            { id: 'masaustu', title: 'Masaüstü', slug: 'masaustu' },
            { id: 'tablet', title: 'Tablet', slug: 'tablet' },
            { id: 'monitor', title: 'Monitör', slug: 'monitor' }
        ]
      },
      { id: 'phone', title: 'Cep Telefonu', slug: 'cep-telefonu', icon: 'Smartphone' },
      { id: 'foto', title: 'Fotoğraf & Kamera', slug: 'fotograf-kamera', icon: 'Camera' },
      { id: 'ev', title: 'Ev Dekorasyon', slug: 'ev-dekorasyon', icon: 'Home' },
      { id: 'giyim', title: 'Giyim & Aksesuar', slug: 'giyim', icon: 'Shirt' },
      { id: 'spor', title: 'Spor', slug: 'spor', icon: 'Dumbbell' }
    ]
  }
];

// --- ARAÇ DETAY VERİSİ (Marka -> Seri -> Model) ---
export const carHierarchy: Record<string, Record<string, string[]>> = {
  "BMW": {
    "1 Serisi": ["116d", "116i", "118d", "118i", "120d", "128ti"],
    "2 Serisi": ["216d", "218i Gran Coupe", "220d"],
    "3 Serisi": ["316i", "318d", "320d", "320i ED", "330i", "M3"],
    "4 Serisi": ["418i", "420d", "420d Gran Coupe", "430i", "M4"],
    "5 Serisi": ["520d", "520i", "525d xDrive", "530i", "M5"],
    "6 Serisi": ["630i", "640d xDrive", "650i"],
    "7 Serisi": ["730d", "740d xDrive", "750i"],
    "X1": ["sDrive16d", "sDrive18i", "xDrive20d"],
    "X3": ["sDrive20i", "xDrive20d"],
    "X5": ["xDrive25d", "xDrive30d", "xDrive40d"]
  },
  "Mercedes-Benz": {
    "A Serisi": ["A 180", "A 180 d", "A 200", "A 45 AMG"],
    "B Serisi": ["B 180", "B 180 d"],
    "C Serisi": ["C 180", "C 200 d", "C 220 d", "C 63 AMG"],
    "E Serisi": ["E 180", "E 200 d", "E 220 d", "E 250", "E 300"],
    "S Serisi": ["S 350 d", "S 400 d", "S 500", "S 580"],
    "CLA": ["CLA 180 d", "CLA 200"],
    "GLA": ["GLA 180 d", "GLA 200"],
    "G Serisi": ["G 350 d", "G 63 AMG"]
  },
  "Audi": {
    "A3": ["A3 Sedan", "A3 Sportback", "S3"],
    "A4": ["A4 Sedan", "A4 Avant"],
    "A5": ["A5 Coupe", "A5 Sportback"],
    "A6": ["A6 Sedan", "A6 Avant"],
    "Q2": ["30 TDI", "35 TFSI"],
    "Q3": ["35 TFSI", "1.4 TFSI"],
    "Q5": ["40 TDI", "2.0 TDI"],
    "Q7": ["50 TDI", "3.0 TDI"]
  },
  "Volkswagen": {
    "Polo": ["1.0 TSI", "1.6 TDI", "GTI"],
    "Golf": ["1.0 eTSI", "1.4 TSI", "1.6 TDI", "R"],
    "Passat": ["1.5 TSI", "1.6 TDI", "2.0 TDI"],
    "Tiguan": ["1.5 TSI", "2.0 TDI"],
    "T-Roc": ["1.5 TSI"],
    "Caddy": ["2.0 TDI"]
  },
  "Renault": {
    "Clio": ["1.0 TCe", "1.5 dCi"],
    "Megane": ["1.3 TCe", "1.5 dCi"],
    "Taliant": ["1.0 Turbo"],
    "Austral": ["1.3 TCe"],
    "Captur": ["1.3 TCe", "1.2 Turbo"]
  },
  "Fiat": {
    "Egea": ["1.4 Fire", "1.3 MultiJet", "1.6 MultiJet"],
    "500": ["1.2 Fire", "1.0 Hybrid"],
    "Panda": ["1.2", "4x4"],
    "Doblo": ["1.3 MultiJet", "1.6 MultiJet"]
  },
  "Ford": {
    "Focus": ["1.5 TDCi", "1.0 EcoBoost"],
    "Fiesta": ["1.25", "1.4 TDCi"],
    "Puma": ["1.0 EcoBoost"],
    "Kuga": ["1.5 EcoBoost", "1.5 TDCi"],
    "Ranger": ["2.0 EcoBlue"]
  },
  "Toyota": {
    "Corolla": ["1.5 Vision", "1.8 Hybrid"],
    "Yaris": ["1.5 Hybrid", "1.0 Vision"],
    "C-HR": ["1.8 Hybrid"],
    "RAV4": ["2.5 Hybrid"],
    "Hilux": ["2.4 D-4D"]
  },
  "Honda": {
    "Civic": ["1.5 VTEC", "1.6 i-DTEC"],
    "City": ["1.5 i-VTEC"],
    "CR-V": ["1.5 VTEC", "2.0 Hybrid"]
  },
  "Hyundai": {
    "i10": ["1.0 MPI", "1.2 MPI"],
    "i20": ["1.4 MPI", "1.0 T-GDI"],
    "Tucson": ["1.6 T-GDI", "1.6 CRDI"],
    "Bayon": ["1.4 MPI"]
  }
};

// --- BİLGİSAYAR DETAY VERİSİ ---
export const computerBrands = [
  "Apple", "Asus", "Lenovo", "HP", "Dell", "Acer", "MSI", "Monster", "Casper", "Huawei", "Samsung"
];