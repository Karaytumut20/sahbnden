const fs = require('fs');
const path = require('path');

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    bold: "\x1b[1m"
};

console.log(colors.cyan + colors.bold + "\n🛠️  SAHİBİNDEN CLONE - İLAN DÜZENLEME MODÜLÜ (EDIT FEATURE)\n" + colors.reset);

function writeFile(filePath, content) {
    const absolutePath = path.join(__dirname, filePath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(absolutePath, content.trim());
    console.log(`${colors.green}✔ Oluşturuldu/Güncellendi:${colors.reset} ${filePath}`);
}

// -------------------------------------------------------------------------
// 1. SERVER ACTIONS GÜNCELLEME (Update Fonksiyonu)
// -------------------------------------------------------------------------
const actionsPath = path.join(__dirname, 'lib', 'actions.ts');
let actionsContent = fs.readFileSync(actionsPath, 'utf8');

const updateActionCode = `
export async function updateAdAction(id: number, formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Giriş yapmalısınız' }

  // Güvenlik: İlanın sahibi mi kontrol et
  const { data: existingAd } = await supabase.from('ads').select('user_id').eq('id', id).single()
  if (!existingAd || existingAd.user_id !== user.id) {
    return { error: 'Bu ilanı düzenleme yetkiniz yok.' }
  }

  // Güncellenecek veriyi hazırla
  const updates = {
    ...formData,
    status: 'onay_bekliyor' // Düzenleme sonrası tekrar onaya düşsün
  }

  const { error } = await supabase.from('ads').update(updates).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/ilan/' + id)
  revalidatePath('/bana-ozel/ilanlarim')
  return { success: true }
}
`;

if (!actionsContent.includes('updateAdAction')) {
    fs.writeFileSync(actionsPath, actionsContent + updateActionCode);
    console.log(`${colors.green}✔ lib/actions.ts güncellendi (Update fonksiyonu eklendi).${colors.reset}`);
} else {
    console.log(`${colors.yellow}ℹ lib/actions.ts zaten güncel.${colors.reset}`);
}


// -------------------------------------------------------------------------
// 2. İLAN DÜZENLEME SAYFASI (app/ilan-duzenle/[id]/page.tsx)
// -------------------------------------------------------------------------
// Bu sayfa, ilan verme sayfasının (create) bir kopyası gibi çalışacak
// ama verileri "default" olarak dolu getirecek.

const editPagePath = 'app/ilan-duzenle/[id]/page.tsx';
const editPageContent = `
"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react'; // React hooks ve Suspense
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, ArrowLeft, Save, Loader2 } from 'lucide-react'; // İkonlar
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import { getAdDetailServer, updateAdAction } from '@/lib/actions'; // Server Actions
import { uploadImageClient, getAdDetail } from '@/lib/services'; // Client Services

// Ana form bileşeni
function EditAdFormContent() {
  const router = useRouter();
  const params = useParams(); // URL'den ID'yi al
  const { addToast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [category, setCategory] = useState('');

  // Sayfa açılınca mevcut ilanı çek
  useEffect(() => {
    const fetchAd = async () => {
        if(!params.id) return;
        // İstemci tarafında detay çekmek için servisi kullanıyoruz
        // (Server Action'ı client'ta doğrudan çağırmak yerine service veya useEffect içinde kullanabiliriz)
        // Burada basitlik için service kullanıyoruz ama veri doluluğu için manuel map yapacağız.

        // Not: lib/services.ts içindeki getAdDetailClient veya benzeri bir fonksiyon olmalıydı.
        // Ancak getAdDetailServer var. Client componentte onu kullanamayız (async component değil).
        // Bu yüzden basit bir fetch veya supabase client çağrısı yapalım.
        // getAdDetail fonksiyonu lib/services.ts'de (fix-all.js ile) client uyumlu hale getirilmiş olabilir mi?
        // fix-all.js'de getAdDetailServer var (actions.ts). services.ts'de getAdDetail yok.
        // Sorun değil, manuel supabase çağrısı yapabiliriz veya action kullanabiliriz (useEffect içinde promise olarak).

        try {
            // Server Action'ı client'ta çağırabiliriz
            const ad = await getAdDetailServer(Number(params.id));
            if (!ad) {
                addToast('İlan bulunamadı.', 'error');
                router.push('/bana-ozel/ilanlarim');
                return;
            }

            // Yetki kontrolü (Basit) - Server Action zaten yapacak ama UX için burada da iyi olur
            if (user && ad.user_id !== user.id) {
                 addToast('Bu ilanı düzenleyemezsiniz.', 'error');
                 router.push('/');
                 return;
            }

            setCategory(ad.category);
            setImages(ad.image ? [ad.image] : []);
            setFormData({
                title: ad.title,
                price: ad.price,
                currency: ad.currency,
                description: ad.description,
                m2: ad.m2,
                room: ad.room,
                floor: ad.floor,
                heating: ad.heating,
                brand: ad.brand,
                year: ad.year,
                km: ad.km,
                gear: ad.gear,
                fuel: ad.fuel,
                status: ad.status_vehicle // DB kolon adı farklı olabilir, formdaki name ile eşleşmeli
            });
        } catch (e) {
            console.error(e);
            addToast('Veri yüklenirken hata oluştu.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if(user) fetchAd();
  }, [user, params.id]);

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    try {
        const url = await uploadImageClient(e.target.files[0]);
        setImages([...images, url]); // Çoklu resim desteği için
        addToast('Resim yüklendi', 'success');
    } catch(e) {
        addToast('Resim yükleme hatası', 'error');
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalData = {
        ...formData,
        category,
        image: images[0] || null,
        price: Number(formData.price),
        year: Number(formData.year),
        km: Number(formData.km),
        m2: Number(formData.m2),
        floor: Number(formData.floor)
    };

    const res = await updateAdAction(Number(params.id), finalData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan güncellendi ve onaya gönderildi.', 'success');
        router.push('/bana-ozel/ilanlarim');
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin mr-2"/> İlan bilgileri yükleniyor...</div>;

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-blue-700"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold text-[#333]">İlanı Düzenle: {formData.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-6">

        {/* Temel Alanlar */}
        <div>
            <label className="block text-xs font-bold mb-1">Başlık</label>
            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold mb-1">Fiyat</label>
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required />
             </div>
             <div>
                <label className="block text-xs font-bold mb-1">Para Birimi</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full border p-2 rounded-sm bg-white">
                    <option>TL</option><option>USD</option><option>EUR</option>
                </select>
             </div>
        </div>

        {/* Dinamik Alanlar */}
        {category === 'emlak' && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
        {category === 'vasita' && <VehicleFields data={formData} onChange={handleDynamicChange} />}

        {/* Resim Yükleme (Basitleştirilmiş: Sadece kapak resmi veya ekleme) */}
        <div>
            <label className="block text-xs font-bold mb-2">Fotoğraflar</label>
            <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                    <div key={i} className="relative group w-24 h-24 border rounded overflow-hidden">
                        <img src={img} className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                    </div>
                ))}
                <div className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded" onClick={() => fileInputRef.current?.click()}>
                    {isUploading ? <Loader2 className="animate-spin text-blue-600"/> : <Upload className="text-gray-400"/>}
                    <span className="text-[10px] text-gray-500 mt-1">Ekle</span>
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        <div>
            <label className="block text-xs font-bold mb-1">Açıklama</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded-sm h-32 resize-none" required></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50">İptal</button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#ffe800] rounded-sm text-sm font-bold text-black hover:bg-yellow-400 flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Güncelle
            </button>
        </div>

      </form>
    </div>
  );
}

export default function EditAdPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Yükleniyor...</div>}>
            <EditAdFormContent />
        </Suspense>
    );
}
`;
writeFile(editPagePath, editPageContent);


// -------------------------------------------------------------------------
// 3. İLANLARIM SAYFASINI GÜNCELLE (Buton Linki)
// -------------------------------------------------------------------------
const myAdsPath = path.join(__dirname, 'app', 'bana-ozel', 'ilanlarim', 'page.tsx');
// Mevcut dosyayı oku ve butonu değiştir
let myAdsContent = fs.readFileSync(myAdsPath, 'utf8');

// Link bileşenini import et (Eğer yoksa)
if (!myAdsContent.includes("import Link")) {
    myAdsContent = myAdsContent.replace("import React", "import Link from 'next/link';\nimport React");
}

// Düzenle butonunu bul ve Link ile değiştir
// Eski kodda: <button ... title="Düzenle"><Edit ... /></button>
// Yeni kodda: <Link href={\`/ilan-duzenle/\${ad.id}\`} ...><Edit ... /></Link>

// Regex ile bulup değiştiriyoruz
// Not: Butonun tam yapısı setup-final.js veya fix-all.js'den geldiği gibi olmalı.
const oldButtonPattern = /<button\s+className="([^"]*)"\s+title="Düzenle">\s*<Edit\s+size=\{14\}\s*\/>\s*<\/button>/;
const newButtonPattern = '<Link href={`/ilan-duzenle/${ad.id}`} className="$1" title="Düzenle"><Edit size={14} /></Link>';

if (oldButtonPattern.test(myAdsContent)) {
    myAdsContent = myAdsContent.replace(oldButtonPattern, newButtonPattern);
    fs.writeFileSync(myAdsPath, myAdsContent);
    console.log(`${colors.green}✔ app/bana-ozel/ilanlarim/page.tsx güncellendi (Düzenle butonu aktif edildi).${colors.reset}`);
} else {
    console.log(`${colors.yellow}⚠ Uyarı: 'İlanlarım' sayfasındaki düzenle butonu otomatik değiştirilemedi. Manuel kontrol gerekebilir.${colors.reset}`);
    // Yedek plan: Dosyayı tamamen yeniden yaz (En garantisi)
    const myAdsFullContent = \`
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserAdsClient, updateAdStatusClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

export default function MyAdsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyAds = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserAdsClient(user.id);
    setAds(data);
    setLoading(false);
  };

  useEffect(() => { fetchMyAds(); }, [user]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await updateAdStatusClient(id, newStatus);
    if (!error) { addToast('İlan durumu güncellendi.', 'success'); fetchMyAds(); }
  };

  if (!user) return <div className="p-6">Giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2 dark:text-white">İlanlarım</h2>
      {loading ? <div className="flex justify-center p-6"><Loader2 className="animate-spin"/></div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[12px] text-gray-500 border-b border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                <th className="p-3">İlan Başlığı</th>
                <th className="p-3">Fiyat</th>
                <th className="p-3">Tarih</th>
                <th className="p-3">Durum</th>
                <th className="p-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] dark:text-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <td className="p-3 font-semibold">{ad.title} <span className="block text-gray-400 text-[10px] font-normal">#{ad.id}</span></td>
                  <td className="p-3 text-blue-900 font-bold dark:text-blue-400">{ad.price.toLocaleString()} {ad.currency}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{new Date(ad.created_at).toLocaleDateString()}</td>
                  <td className="p-3"><span className={\`px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700\`}>{ad.status}</span></td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={\`/ilan-duzenle/\${ad.id}\`} className="p-1.5 border border-gray-300 rounded hover:bg-blue-50 text-blue-600" title="Düzenle">
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => { if(confirm('Silmek istiyor musunuz?')) handleStatusChange(ad.id, 'pasif'); }} className="p-1.5 border border-gray-300 rounded hover:bg-red-50 text-red-600" title="Kaldır">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
    \`;
    fs.writeFileSync(myAdsPath, myAdsContent.trim());
}


// -------------------------------------------------------------------------
// 4. MIDDLEWARE GÜNCELLEME (Yeni Rotayı Korumaya Al)
// -------------------------------------------------------------------------
const middlewarePath = 'middleware.ts';
let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

// '/ilan-duzenle' rotasını protectedRoutes dizisine ekle
if (!middlewareContent.includes("'/ilan-duzenle'")) {
    middlewareContent = middlewareContent.replace(
        "const protectedRoutes = ['/bana-ozel', '/ilan-ver'",
        "const protectedRoutes = ['/bana-ozel', '/ilan-ver', '/ilan-duzenle'"
    );
    fs.writeFileSync(middlewarePath, middlewareContent);
    console.log(`${colors.green}✔ middleware.ts güncellendi (Yeni rota korumaya alındı).${colors.reset}`);
}

console.log(colors.bold + "\n🎉 İLAN DÜZENLEME MODÜLÜ AKTİF!" + colors.reset);
