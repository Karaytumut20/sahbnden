export const cities = [
  { name: 'İstanbul', districts: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Maltepe', 'Kartal', 'Pendik', 'Ümraniye', 'Ataşehir', 'Beylikdüzü', 'Esenyurt'] },
  { name: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı'] },
  { name: 'İzmir', districts: ['Karşıyaka', 'Konak', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Balçova', 'Narlıdere', 'Urla', 'Çeşme'] },
  { name: 'Antalya', districts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 'Kemer', 'Kaş'] },
  { name: 'Bursa', districts: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'İnegöl', 'Gemlik'] },
  { name: 'Adana', districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam'] },
  { name: 'Kocaeli', districts: ['İzmit', 'Gebze', 'Darıca', 'Gölcük', 'Körfez', 'Derince', 'Kartepe', 'Başiskele', 'Karamürsel'] },
  { name: 'Konya', districts: ['Selçuklu', 'Meram', 'Karatay'] },
  { name: 'Gaziantep', districts: ['Şahinbey', 'Şehitkamil'] },
  { name: 'Mersin', districts: ['Yenişehir', 'Mezitli', 'Akdeniz', 'Toroslar', 'Erdemli'] },
  { name: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı'] },
  { name: 'Samsun', districts: ['Atakum', 'İlkadım', 'Canik'] },
  { name: 'Kayseri', districts: ['Melikgazi', 'Kocasinan', 'Talas'] },
  { name: 'Sakarya', districts: ['Adapazarı', 'Serdivan', 'Erenler'] },
  { name: 'Muğla', districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Menteşe', 'Milas'] },
  { name: 'Trabzon', districts: ['Ortahisar', 'Akçaabat', 'Yomra'] },
  { name: 'Tekirdağ', districts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy'] },
  { name: 'Hatay', districts: ['Antakya', 'İskenderun', 'Defne'] },
  { name: 'Manisa', districts: ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu'] },
  { name: 'Balıkesir', districts: ['Altıeylül', 'Karesi', 'Edremit', 'Bandırma'] },
  { name: 'Diyarbakır', districts: ['Bağlar', 'Kayapınar', 'Yenişehir'] },
  { name: 'Şanlıurfa', districts: ['Haliliye', 'Eyyübiye', 'Karaköprü'] }
].sort((a, b) => a.name.localeCompare(b.name));

export const getDistricts = (cityName: string) => {
  const city = cities.find(c => c.name === cityName);
  return city ? city.districts.sort() : [];
};