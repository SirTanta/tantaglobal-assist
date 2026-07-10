import Image from "next/image";

const IMAGES = [
  "/images/hero/photo-1.jpg",
  "/images/hero/photo-2.jpg",
  "/images/hero/photo-3.jpg",
  "/images/hero/photo-4.jpg",
  "/images/hero/photo-5.jpg",
];

export default function HeroImageRotator() {
  return (
    <>
      {IMAGES.map((src, i) => (
        <div key={src} className="instr-hero-photo-slide">
          <Image
            src={src}
            alt=""
            fill
            sizes="50vw"
            quality={90}
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
    </>
  );
}
