import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../services/api';
import { useTelegram } from '../../providers/TelegramProvider';

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5
}) => {
  const { hapticImpact, hapticNotification } = useTelegram();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed per listing.`);
      hapticNotification('warning');
      return;
    }

    setError(null);
    setUploading(true);
    hapticImpact('medium');

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await apiClient.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.data?.urls) {
        onChange([...images, ...response.data.data.urls]);
        hapticNotification('success');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to upload image files.');
      hapticNotification('error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    hapticImpact('light');
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Property Photos ({images.length}/{maxImages})
        </label>
        {images.length > 0 && (
          <span className="text-[10px] text-emerald-400 font-medium">
            {images.length} photo{images.length > 1 ? 's' : ''} uploaded
          </span>
        )}
      </div>

      {/* Image Thumbnails Grid */}
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, index) => (
          <div key={url + index} className="relative h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
            <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 p-1 bg-slate-950/80 hover:bg-red-500/80 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload Trigger Button */}
        {images.length < maxImages && (
          <label className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            uploading
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-800 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900'
          }`}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-[10px] text-slate-400">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-medium text-slate-300">Add Photos</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <p className="text-[10px] text-red-400 pt-1">{error}</p>}
    </div>
  );
};