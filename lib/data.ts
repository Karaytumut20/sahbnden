import { Home, Car, Monitor, Briefcase, ShoppingCart, Map, Sun, Smartphone, Camera, Shirt, Watch, Baby, Gamepad2, BookOpen, Music, Dumbbell, Gem, Hammer, PenTool, Coffee } from 'lucide-react';

export const categories = [
  {
    id: 'emlak', title: 'Emlak', icon: 'Home', slug: 'emlak',
    subs: [
      { id: 'konut', title: 'Konut', slug: 'konut', subs: [{ id: 'konut-satilik', title: 'Satılık', slug: 'konut-satilik' }, { id: 'konut-kiralik', title: 'Kiralık', slug: 'konut-kiralik' }] },
      { id: 'isyeri', title: 'İş Yeri', slug: 'isyeri', subs: [{ id: 'isyeri-satilik', title: 'Satılık İş Yeri', slug: 'isyeri-satilik' }] },
      { id: 'arsa', title: 'Arsa', slug: 'arsa' }
    ]
  },
  {
    id: 'vasita', title: 'Vasıta', icon: 'Car', slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
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
                    { id: 'laptop', title: 'Laptop', slug: 'laptop' },
                    {
                        id: 'notebook-donanim', title: 'Dizüstü Donanım', slug: 'dizustu-donanim',
                        subs: [
                            { id: 'd-islemci', title: 'İşlemci', slug: 'dizustu-islemci' },
                            { id: 'd-ram', title: 'RAM Bellek', slug: 'dizustu-ram' },
                            { id: 'd-disk', title: 'Harddisk', slug: 'dizustu-hdd' },
                            { id: 'd-ssd', title: 'SSD', slug: 'dizustu-ssd' }
                        ]
                    },
                    {
                        id: 'notebook-yedek', title: 'Yedek Parça', slug: 'dizustu-yedek',
                        subs: [
                            { id: 'd-anakart', title: 'Anakart', slug: 'dizustu-anakart' },
                            { id: 'd-ekran', title: 'Ekran', slug: 'dizustu-ekran' },
                            { id: 'd-klavye', title: 'Klavye', slug: 'dizustu-klavye' },
                            { id: 'd-batarya', title: 'Batarya', slug: 'dizustu-batarya' },
                            { id: 'd-kasa', title: 'Kasa & Parçaları', slug: 'dizustu-kasa' }
                        ]
                    }
                ]
            },
            {
                id: 'masaustu', title: 'Masaüstü', slug: 'masaustu',
                subs: [
                    { id: 'masaustu-model', title: 'Modeller', slug: 'masaustu-modeller' },
                    {
                        id: 'masaustu-donanim', title: 'Masaüstü Donanım', slug: 'masaustu-donanim',
                        subs: [
                             { id: 'm-anakart', title: 'Anakart', slug: 'masaustu-anakart' },
                             { id: 'm-islemci', title: 'İşlemci', slug: 'masaustu-islemci' },
                             { id: 'm-ram', title: 'RAM Bellek', slug: 'masaustu-ram' },
                             { id: 'm-ekran-karti', title: 'Ekran Kartı', slug: 'masaustu-ekran-karti' },
                             { id: 'm-kasa', title: 'Kasa', slug: 'masaustu-kasa' },
                             { id: 'm-guc', title: 'Güç Kaynağı', slug: 'masaustu-psu' },
                             { id: 'm-monitor', title: 'Monitör', slug: 'monitor' }
                        ]
                    }
                ]
            },
            { id: 'tablet', title: 'Tablet', slug: 'tablet' },
            { id: 'sunucu', title: 'Sunucu (Server)', slug: 'sunucu' },
        ]
      },
      { id: 'phone', title: 'Cep Telefonu & Aksesuar', slug: 'cep-telefonu', icon: 'Smartphone' },
      { id: 'foto', title: 'Fotoğraf & Kamera', slug: 'fotograf-kamera', icon: 'Camera' },
      { id: 'ev', title: 'Ev Dekorasyon', slug: 'ev-dekorasyon', icon: 'Home' },
      { id: 'giyim', title: 'Giyim & Aksesuar', slug: 'giyim', icon: 'Shirt' },
      { id: 'saat', title: 'Saat', slug: 'saat', icon: 'Watch' },
      { id: 'anne', title: 'Anne & Bebek', slug: 'anne-bebek', icon: 'Baby' },
      { id: 'oyun', title: 'Hobi & Oyuncak', slug: 'hobi-oyuncak', icon: 'Gamepad2' },
      { id: 'kitap', title: 'Kitap, Dergi & Film', slug: 'kitap', icon: 'BookOpen' },
      { id: 'muzik', title: 'Müzik', slug: 'muzik', icon: 'Music' },
      { id: 'spor', title: 'Spor', slug: 'spor', icon: 'Dumbbell' },
      { id: 'taki', title: 'Takı & Mücevher', slug: 'taki', icon: 'Gem' },
      { id: 'yapi', title: 'Bahçe & Yapı Market', slug: 'yapi-market', icon: 'Hammer' },
      { id: 'ofis', title: 'Ofis & Kırtasiye', slug: 'ofis', icon: 'PenTool' },
      { id: 'gida', title: 'Yiyecek & İçecek', slug: 'gida', icon: 'Coffee' },
    ]
  }
];

export const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'];