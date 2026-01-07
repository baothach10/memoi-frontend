import Image from "next/image";

interface ImageColumnProps {
  images: string[];
}

export default function ImageColumn({ images }: ImageColumnProps) {
  return (
    <div className="flex flex-col">
      {images.map((src, index) => (
        <div
          key={index}
          className="relative w-full h-[calc(100vh-120px)] bg-black/2"
        >
          <Image
            src={src}
            alt={`Product image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}
