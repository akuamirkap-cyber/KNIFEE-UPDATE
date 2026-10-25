import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Maximize2,
  ExternalLink,
  Gamepad2,
  Sparkles,
  Layers,
  Smartphone,
  ChevronDown,
  Volume2,
  Info,
  X,
  Play
} from 'lucide-react';

interface GameItem {
  id: string;
  path: string;
  slideNumber: number;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  desc: string;
}

const GAMES: GameItem[] = [
  {
    id: 'game-1',
    path: '/games/game-1/index.html',
    slideNumber: 1,
    title: 'Weapon Hit Arena',
    subtitle: '2D Shooting Effects',
    tag: 'Arena Ballistics',
    tagColor: 'from-amber-500 to-orange-500',
    desc: 'Simulasi tembakan multi-senjata dengan putaran roda dan variasi lintasan peluru 2D.'
  },
  {
    id: 'game-2',
    path: '/games/game-2/index.html',
    slideNumber: 2,
    title: 'Weapon Wheel Hit',
    subtitle: 'Ultra FX Edition',
    tag: 'Ultra FX',
    tagColor: 'from-cyan-500 to-blue-500',
    desc: 'Efek putaran roda ultra-vibrant dengan impact partikel neon dinamis.'
  },
  {
    id: 'game-3',
    path: '/games/game-3/index.html',
    slideNumber: 3,
    title: 'Acid · Air Cannon · Plasma · Black Hole',
    subtitle: 'Level 1 Arsenal',
    tag: 'Elemental Weapons',
    tagColor: 'from-emerald-500 to-teal-500',
    desc: 'Kategori senjata elemen: Acid, Air Cannon, Plasma, dan Black Hole dengan proyektil khusus.'
  },
  {
    id: 'game-4',
    path: '/games/game-4/index.html',
    slideNumber: 4,
    title: 'Weapon Hit — 71 Senjata',
    subtitle: 'Level 1 (Efek Tembakan 2D)',
    tag: '71 Senjata',
    tagColor: 'from-purple-500 to-pink-500',
    desc: 'Koleksi komprehensif 71 senjata dengan animasi tembakan, proyektil, recoil, dan audio synth.'
  },
  {
    id: 'game-5',
    path: '/games/game-5/index.html',
    slideNumber: 5,
    title: 'ARSENAL - Neon Ballistics',
    subtitle: 'Level 01 Edition',
    tag: 'Neon Ballistics',
    tagColor: 'from-rose-500 to-red-500',
    desc: 'Satu roda, tujuh hit bersih, dan 17 senjata 2D dengan animasi presisi dan suara khas.'
  },
  {
    id: 'game-6',
    path: '/games/game-6/index.html',
    slideNumber: 6,
    title: 'Arsenal Wheel Hit',
    subtitle: '2D Weapon FX Range',
    tag: 'Range Edition',
    tagColor: 'from-yellow-500 to-amber-500',
    desc: 'Galeri tembak presisi Knife Hit dengan senjata elektro, api, sci-fi, dan firearms.'
  },
  {
    id: 'game-7',
    path: '/games/game-7/index.html',
    slideNumber: 7,
    title: 'Arsenal FX — Ballistics Lab',
    subtitle: 'Shape, Flash & Impact',
    tag: 'Ballistics Lab',
    tagColor: 'from-indigo-500 to-violet-500',
    desc: 'Galeri efek tembakan 2D: bentuk peluru, muzzle flash, impact, dan roda putar.'
  },
  {
    id: 'game-8',
    path: '/games/game-8/index.html',
    slideNumber: 8,
    title: 'Arsenal FX – Knife-Hit Effects',
    subtitle: 'Fantasy & Sci-Fi Arsenal',
    tag: 'Knife-Hit FX',
    tagColor: 'from-fuchsia-500 to-rose-500',
    desc: 'Koleksi senjata dragon, plasmacaster, sci-fi, dan firearms dengan efek benturan tajam.'
  }
];

export default function App() {
  const [fullscreenGame, setFullscreenGame] = useState<GameItem | null>(null);
  const [iframeKeys, setIframeKeys] = useState<Record<string, number>>({});
  const [columnsMode, setColumnsMode] = useState<'2-col' | '1-col'>('2-col');
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleReload = (gameId: string) => {
    setIframeKeys((prev) => ({
      ...prev,
      [gameId]: (prev[gameId] || 0) + 1
    }));
  };

  const handleReloadAll = () => {
    const newKeys: Record<string, number> = {};
    GAMES.forEach((g) => {
      newKeys[g.id] = (iframeKeys[g.id] || 0) + 1;
    });
    setIframeKeys(newKeys);
  };

  const scrollToSlide = (gameId: string) => {
    const el = slideRefs.current[gameId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  ARSENAL 2D WEAPONS LAB
                </h1>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  8 Games Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Semua game dijejer 2 ke kanan & sisanya ke bawah • Slide Rasio 9:16 Tanpa Terpotong
              </p>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl bg-slate-900 border border-white/10 p-1">
              <button
                onClick={() => setColumnsMode('2-col')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  columnsMode === '2-col'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilkan 2 Kolom ke Kanan"
              >
                2 Kolom (Grid)
              </button>
              <button
                onClick={() => setColumnsMode('1-col')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  columnsMode === '1-col'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilkan 1 Kolom Fokus"
              >
                1 Kolom (Fokus)
              </button>
            </div>

            {/* Reset All */}
            <button
              onClick={handleReloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/10 transition-colors active:scale-95"
              title="Muat ulang seluruh 8 game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Semua</span>
            </button>
          </div>
        </div>

        {/* Quick Slide Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-medium text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" /> Lompat ke:
          </span>
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => scrollToSlide(g.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors shrink-0 flex items-center gap-1"
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-amber-400">
                {g.slideNumber}
              </span>
              <span className="max-w-[110px] truncate">{g.title}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content: 2-column Grid of 9:16 Slides */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-900/40 border border-amber-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                Format Slide Portabel Rasio Murni 9:16 (Bebas Crop)
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Setiap slide dapat dimainkan secara live langsung di dalam frame. Klik tombol <Maximize2 className="w-3 h-3 inline mx-0.5 text-amber-400" /> untuk tampilan besar atau <RotateCcw className="w-3 h-3 inline mx-0.5 text-slate-300" /> untuk restart level.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-amber-400/80 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 shrink-0">
            <span>2 Kolom</span>
            <span>•</span>
            <span>4 Baris Slide</span>
          </div>
        </div>

        {/* The 2-Column Grid of 9:16 Slides */}
        <div
          className={`grid gap-8 ${
            columnsMode === '2-col'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 max-w-2xl mx-auto'
          }`}
        >
          {GAMES.map((game) => {
            const key = iframeKeys[game.id] || 0;
            return (
              <div
                key={game.id}
                ref={(el) => {
                  slideRefs.current[game.id] = el;
                }}
                className="flex flex-col bg-slate-900/70 rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:border-amber-500/30 transition-all duration-300 group"
              >
                {/* Slide Header Bar */}
                <div className="px-4 py-3 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                      SLIDE {game.slideNumber.toString().padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                        {game.title}
                      </h2>
                      <p className="text-[11px] text-slate-400 truncate">
                        {game.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions for this specific slide */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleReload(game.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Reset game ini"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFullscreenGame(game)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 transition-colors"
                      title="Buka Layar Penuh"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={game.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Buka di tab baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 9:16 Slide Container (Strict 9:16 aspect ratio, zero crop) */}
                <div className="p-3 sm:p-4 bg-black/40 flex items-center justify-center flex-1">
                  <div className="w-full max-w-[440px] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-inner border border-white/15 bg-black">
                    
                    {/* Simulated Phone Bezel Gloss */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-white/10 z-20" />

                    {/* The Live Interactive Game Iframe */}
                    <iframe
                      key={`${game.id}-${key}`}
                      src={game.path}
                      title={game.title}
                      loading="lazy"
                      className="w-full h-full border-0 block bg-black"
                      allow="autoplay; gamepad"
                    />
                  </div>
                </div>

                {/* Slide Footer Details */}
                <div className="px-4 py-2.5 bg-slate-950/90 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5 truncate max-w-[70%]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">{game.desc}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0">
                    9:16 PORTRAIT
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Fullscreen / Theater Modal */}
      {fullscreenGame && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md flex flex-col bg-slate-900 rounded-3xl border border-white/20 overflow-hidden shadow-2xl relative max-h-[96vh]">
            
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SLIDE {fullscreenGame.slideNumber.toString().padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold text-white truncate">
                  {fullscreenGame.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleReload(fullscreenGame.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Reload Game"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFullscreenGame(null)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                  title="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal 9:16 Frame */}
            <div className="flex-1 p-2 bg-black flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-[420px] aspect-[9/16] relative rounded-2xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  key={`modal-${fullscreenGame.id}-${iframeKeys[fullscreenGame.id] || 0}`}
                  src={fullscreenGame.path}
                  title={fullscreenGame.title}
                  className="w-full h-full border-0 block bg-black"
                  allow="autoplay; gamepad"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 bg-slate-950 border-t border-white/10 text-center text-xs text-slate-400">
              <span>{fullscreenGame.desc}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#07090e] py-6 px-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>ARSENAL 2D WEAPONS SHOWCASE</span>
          <span>•</span>
          <span>8 LIVE SLIDES</span>
          <span>•</span>
          <span>9:16 ASPECT RATIO</span>
        </p>
      </footer>
    </div>
  );
}
