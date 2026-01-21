import { Home, Car, Monitor, Briefcase, ShoppingCart, Map, Sun } from 'lucide-react';

export const categories = [
  {
    id: 'emlak',
    title: 'Emlak',
    icon: 'Home',
    slug: 'emlak',
    subs: [
      {
        id: 'konut',
        title: 'Konut',
        slug: 'konut',
        subs: [
            { id: 'konut-satilik', title: 'Satılık', slug: 'konut-satilik' },
            { id: 'konut-kiralik', title: 'Kiralık', slug: 'konut-kiralik' },
            { id: 'gunluk-kiralik', title: 'Günlük Kiralık', slug: 'gunluk-kiralik' },
        ]
      },
      {
        id: 'isyeri',
        title: 'İş Yeri',
        slug: 'is-yeri',
        subs: [
            { id: 'isyeri-satilik', title: 'Satılık İş Yeri', slug: 'isyeri-satilik' },
            { id: 'isyeri-kiralik', title: 'Kiralık İş Yeri', slug: 'isyeri-kiralik' },
        ]
      },
      {
        id: 'arsa',
        title: 'Arsa',
        slug: 'arsa',
        subs: [
            { id: 'arsa-satilik', title: 'Satılık Arsa', slug: 'arsa-satilik' },
            { id: 'arsa-kiralik', title: 'Kiralık Arsa', slug: 'arsa-kiralik' },
        ]
      }
    ]
  },
  {
    id: 'vasita',
    title: 'Vasıta',
    icon: 'Car',
    slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
    ]
  },
  {
    id: 'alisveris',
    title: 'İkinci El ve Sıfır Alışveriş',
    icon: 'ShoppingCart',
    slug: 'alisveris',
    subs: [
      { id: 'pc', title: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'phone', title: 'Cep Telefonu', slug: 'cep-telefonu-ve-aksesuar' },
    ]
  }
];

export const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'];