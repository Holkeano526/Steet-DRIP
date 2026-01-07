
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        onClick={handleClick}
        className={`relative group aspect-[3/4] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center
          ${currentImage ? 'border-emerald-500/50' : 'border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/50'}
        `}
      >
        {currentImage ? (
          <>
            <img src={currentImage} alt="Input" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-full text-sm">Change Image</span>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-zinc-500 mb-4 group-hover:text-emerald-500 transition-colors"></i>
            <p className="text-zinc-300 font-medium mb-1">Upload Source Portrait</p>
            <p className="text-zinc-500 text-xs">JPG, PNG up to 10MB</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      <p className="mt-4 text-xs text-zinc-500 text-center italic">
        Likeness and features from this image will be used to generate the final street grit portrait.
      </p>
    </div>
  );
};

export default ImageUploader;
