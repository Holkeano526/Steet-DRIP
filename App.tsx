
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { generateGritPortrait } from './services/gemini';
import { GeneratedImage, GenerationStatus } from './types';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<GenerationStatus>({ loading: false, error: null });

  const handleGenerate = async () => {
    if (!sourceImage) return;

    setStatus({ loading: true, error: null });
    try {
      const generatedUrl = await generateGritPortrait(sourceImage);
      const newResult: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: generatedUrl,
        timestamp: Date.now(),
      };
      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        error: err instanceof Error ? err.message : "Failed to generate portrait. Please try again." 
      });
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const resetError = () => setStatus(prev => ({ ...prev, error: null }));

  return (
    <div className="min-h-screen grainy-bg">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Upload and Controls */}
          <section className="space-y-8 sticky top-24">
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                AUTHENTIC <br />
                <span className="text-zinc-500">STREET PHOTOGRAPHY</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-md">
                Generate high-contrast, documentary-style portraits using direct flash aesthetics. 
                Complete with oversized urban wear and canine companions.
              </p>
            </div>

            <ImageUploader 
              currentImage={sourceImage} 
              onImageSelected={(img) => {
                setSourceImage(img);
                resetError();
              }} 
            />

            <div className="space-y-4">
              <button
                disabled={!sourceImage || status.loading}
                onClick={handleGenerate}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3
                  ${!sourceImage || status.loading 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/20'
                  }
                `}
              >
                {status.loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>DEVELOPING FILM...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-camera-retro"></i>
                    <span>GENERATE PORTRAIT</span>
                  </>
                )}
              </button>

              {status.error && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start space-x-3">
                  <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                  <span>{status.error}</span>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">STYLE CHARACTERISTICS</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Direct Flash', 'Dusk Lighting', 'Green Undertones', '28mm Lens', 'Urban Grit', 'Cuban Chain'].map(tag => (
                  <div key={tag} className="flex items-center space-x-2 text-zinc-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="font-display text-2xl font-bold">LATEST SHOTS</h3>
              <span className="text-xs text-zinc-500 font-medium">{results.length} EXPOSURES</span>
            </div>

            {results.length === 0 ? (
              <div className="aspect-[3/4] rounded-xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-zinc-600">
                <i className="fa-solid fa-images text-5xl mb-4 opacity-20"></i>
                <p>No portraits generated yet</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {results.map((img) => (
                  <div key={img.id} className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl transition-all hover:border-emerald-500/30">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img 
                        src={img.url} 
                        alt="Generated Street Grit Portrait" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button 
                          onClick={() => window.open(img.url, '_blank')}
                          className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-colors"
                        >
                          <i className="fa-solid fa-expand"></i>
                        </button>
                        <a 
                          href={img.url} 
                          download={`street-grit-${img.id}.png`}
                          className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-colors"
                        >
                          <i className="fa-solid fa-download"></i>
                        </a>
                      </div>
                    </div>
                    <div className="p-6 flex justify-between items-center bg-black/40 border-t border-zinc-800">
                      <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">LOCATION: ALLEYWAY</p>
                        <p className="text-white font-display text-sm">Exposure #{img.id.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-500 text-xs mb-1">PROCESSED</p>
                        <p className="text-emerald-500 font-mono text-xs">{new Date(img.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-24 border-t border-zinc-800 py-12 bg-black">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2 opacity-50">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
            <span className="font-display font-bold tracking-tight">STREETGRIT</span>
          </div>
          <p className="text-zinc-600 text-xs">© 2024 RAW DOCUMENTARY ARCHIVE. POWERED BY GEMINI 2.5.</p>
          <div className="flex space-x-6 text-zinc-500">
            <a href="#" className="hover:text-emerald-500 transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-emerald-500 transition-colors"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="hover:text-emerald-500 transition-colors"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
