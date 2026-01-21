import { supabase } from './supabase';

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const cleanFileName = Math.random().toString(36).substring(2, 15);
  const fileName = `${Date.now()}-${cleanFileName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('ads')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Yükleme hatası:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('ads').getPublicUrl(fileName);
  return data.publicUrl;
}