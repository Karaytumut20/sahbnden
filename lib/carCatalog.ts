export interface TechnicalSpecs {
  overview: {
    production_years: string;
    segment: string;
    body_type_detail: string;
    engine_cylinders: string;
    consumption_city: string;
    consumption_highway: string;
    power_hp: string;
    transmission_detail: string;
    acceleration: string;
    top_speed: string;
    mtv: string;
  };
  engine_performance: {
    engine_type: string;
    engine_volume: string;
    max_power_detail: string;
    max_torque: string;
    acceleration: string;
    top_speed: string;
  };
  fuel_consumption: {
    fuel_type_detail: string;
    city: string;
    highway: string;
    average: string;
    tank_volume: string;
  };
  dimensions: {
    seats: string;
    length: string;
    width: string;
    height: string;
    weight: string;
    luggage: string;
    tires: string;
  };
}

export interface CarModel {
  id: string;
  name: string;
  specs?: TechnicalSpecs;
}

// BMW 6 Serisi Örneği ve Diğer Popüler Modeller
export const carCatalog: Record<string, Record<string, CarModel[]>> = {
  "BMW": {
    "6 Serisi": [
      {
        id: "640d_xdrive_cabrio",
        name: "640d xDrive Cabrio",
        specs: {
          overview: {
            production_years: "2011 / 2017",
            segment: "F Segment",
            body_type_detail: "Cabrio / 2 Kapı",
            engine_cylinders: "Dizel / 6 silindir",
            consumption_city: "7.1 lt",
            consumption_highway: "5.1 lt",
            power_hp: "313 hp",
            transmission_detail: "Otomatik / 8 Vites / 4x4",
            acceleration: "5.4 sn",
            top_speed: "250 km/saat",
            mtv: "8.523,00 TL x 2 (2014 model)"
          },
          engine_performance: {
            engine_type: "Dizel / 6 silindir",
            engine_volume: "2993 cc",
            max_power_detail: "313 hp (230 kw) / 4.400 rpm",
            max_torque: "630 Nm / 1.500 rpm",
            acceleration: "5.4 sn",
            top_speed: "250 km/saat"
          },
          fuel_consumption: {
            fuel_type_detail: "Dizel / EURO 6",
            city: "7.1 lt",
            highway: "5.1 lt",
            average: "5.9 lt",
            tank_volume: "70 lt"
          },
          dimensions: {
            seats: "4 Koltuk",
            length: "4894 mm",
            width: "1894 mm",
            height: "1365 mm",
            weight: "2005 kg",
            luggage: "300 lt",
            tires: "245/45 R18"
          }
        }
      },
      { id: "640d_coupe", name: "640d Coupe" },
      { id: "650i_cabrio", name: "650i Cabrio" },
      { id: "630i_cabrio", name: "630i Cabrio" }
    ],
    "3 Serisi": [
      { id: "320d_sedan", name: "320d Sedan" },
      { id: "320i_ed", name: "320i EfficientDynamics" },
      { id: "318i", name: "318i" }
    ],
    "5 Serisi": [
      { id: "520d_sedan", name: "520d Sedan" },
      { id: "520i_sedan", name: "520i Sedan" },
      { id: "525d_xdrive", name: "525d xDrive" }
    ]
  },
  "Mercedes-Benz": {
    "C Serisi": [
      { id: "c200d_amg", name: "C 200 d AMG" },
      { id: "c180_avantgarde", name: "C 180 Avantgarde" }
    ],
    "E Serisi": [
      { id: "e180_exclusive", name: "E 180 Exclusive" },
      { id: "e250_cdi_4matic", name: "E 250 CDI 4MATIC" }
    ]
  },
  "Audi": {
    "A3": [{ id: "a3_sedan_35_tfsi", name: "A3 Sedan 35 TFSI" }],
    "A6": [{ id: "a6_40_tdi_quattro", name: "A6 Sedan 40 TDI quattro" }]
  },
  "Volkswagen": {
    "Passat": [{ id: "passat_15_tsi_elegance", name: "1.5 TSI Elegance" }],
    "Golf": [{ id: "golf_10_etsi_rline", name: "1.0 eTSI R-Line" }]
  },
  "Renault": {
    "Clio": [{ id: "clio_10_tce_joy", name: "1.0 TCe Joy" }],
    "Megane": [{ id: "megane_13_tce_icon", name: "1.3 TCe Icon" }]
  },
  "Fiat": {
    "Egea": [{ id: "egea_14_fire_urban", name: "1.4 Fire Urban" }]
  },
  "Ford": {
    "Focus": [{ id: "focus_15_tdci_titanium", name: "1.5 TDCi Titanium" }]
  },
  "Toyota": {
    "Corolla": [{ id: "corolla_15_dream", name: "1.5 Dream" }]
  }
};