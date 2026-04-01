'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

interface ImageUploadProps {
  bucket: 'avatars' | 'banners';
  userId: string;
  currentUrl: string | null;
  onUploadComplete: (url: string) => void;
  label: string;
  aspectRatio?: 'square' | 'banner';
}

export default function ImageUpload({ bucket, userId, currentUrl, onUploadComplete, label, aspectRatio = 'square' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image trop lourde. Maximum 2MB.');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${userId}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploadComplete(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <label className={`
        relative flex items-center justify-center cursor-pointer overflow-hidden
        border-2 border-dashed border-muted-foreground/30 rounded-xl
        hover:border-primary/50 transition-colors bg-muted/30
        ${aspectRatio === 'banner' ? 'w-full h-32' : 'w-24 h-24 rounded-full'}
      `}>
        {currentUrl ? (
          <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground text-center px-2">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Cliquer pour uploader'}
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      {currentUrl && (
        <p className="text-[10px] text-muted-foreground">Cliquer sur l'image pour la remplacer</p>
      )}
    </div>
  );
}
