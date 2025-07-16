"use client";

import MetaBalls from "@/blocks/Animations/MetaBalls/MetaBalls";
import LetterGlitch from "@/blocks/Backgrounds/LetterGlitch/LetterGlitch";

export default function EffectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 主要内容 */}
      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            探索各种CSS特效和动画效果，包括粒子动画、渐变效果、3D变换等现代Web特效
          </p>
        </div>
        <div className="mt-6 bg-black rounded-sm overflow-hidden">
          <MetaBalls
            color="#ffffff"
            cursorBallColor="#ffffff"
            cursorBallSize={2}
            ballCount={32}
            animationSize={32}
            enableMouseInteraction={true}
            enableTransparency={true}
            hoverSmoothness={0.05}
            clumpFactor={1.6}
            speed={0.9}
          />
        </div>

        <div className="mt-6 bg-white rounded-sm overflow-hidden">
          <LetterGlitch
            glitchSpeed={80}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
        </div>
      </div>
    </div>
  );
}
