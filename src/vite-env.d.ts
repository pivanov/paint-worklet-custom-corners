/// <reference types="vite/client" />

declare namespace CSS {
  const paintWorklet: Worklet | undefined;
}

declare function registerPaint(name: string, paintCtor: PaintInstanceConstructor): void
