
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center text-black font-bold text-xl">S</div>
          <h1 className="font-display text-xl font-bold tracking-tight">STREET<span className="text-emerald-500">GRIT</span></h1>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">GALLERY</a>
          <a href="#" className="hover:text-white transition-colors">STYLE GUIDE</a>
          <a href="#" className="hover:text-white transition-colors">ARCHIVE</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
