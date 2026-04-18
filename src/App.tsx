/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-dark text-text-main font-display flex flex-col lg:grid lg:grid-cols-[280px_1fr] lg:grid-rows-[80px_1fr]">
      {/* Header */}
      <header className="col-span-1 lg:col-span-2 border-b-2 border-[#222] flex items-center px-10 bg-gradient-to-r from-[#050505] to-[#111111] h-[80px]">
        <div className="text-[28px] font-black tracking-[-1px] text-neon-blue uppercase">
          Neon Synth // v1.0
        </div>
      </header>

      {/* Sidebar Area */}
      <aside className="lg:border-r-2 border-b-2 lg:border-b-0 border-[#222] p-8 flex flex-col gap-8 bg-bg-dark lg:row-start-2">
        <h2 className="text-xs uppercase text-text-dim tracking-[2px] font-bold">Station Alpha</h2>
        <MusicPlayer />
      </aside>

      {/* Main Game Area */}
      <main className="flex items-center justify-center p-8 relative bg-bg-dark lg:row-start-2 min-h-[600px] overflow-hidden">
        <SnakeGame />
      </main>
    </div>
  );
}
