import { assetSrc } from "@/components/site";
import { useState } from "react";
import burgundy from "@/assets/mou/burgundy.png.asset.json";
import white from "@/assets/mou/white.png.asset.json";

const photos = [
  { src: assetSrc(burgundy), alt: "Mou Barrac in a burgundy shirt, seated with a stack of books" },
  { src: assetSrc(white), alt: "Mou Barrac in a white shirt, seated on a black chair" },
];

export function PhotoStack() {
  const [front, setFront] = useState(0);
  return <div className="mx-auto w-full max-w-sm">
    <button type="button" onClick={() => setFront((f) => (f + 1) % photos.length)}
      aria-label="Show the other photo of Mou Barrac" className="relative block aspect-[2/3] w-full">
      {photos.map((p, i) => {
        const isFront = i === front;
        return <img key={p.src} decoding="async" src={p.src} alt={isFront ? p.alt : ""} aria-hidden={!isFront} width={1024} height={1536}
          className={`absolute inset-0 h-full w-full rounded-md border object-cover shadow-lg transition-transform duration-300 ${isFront ? "z-10 -rotate-3" : "z-0 translate-x-6 rotate-6 opacity-90"}`} />;
      })}
    </button>
    <p className="mt-6 text-center text-sm text-muted-foreground">Tap to swipe image</p>
  </div>;
}
