import Image from "next/image";

interface BlogImageProps {
  src: string;
  alt: string;
  caption: string;
  layout?: "fixed" | "fill" | "intrinsic" | "responsive";
  width?: number;
  height?: number;
}

export default function BlogImage({
  src,
  alt,
  caption,
  layout,
  width,
  height,
}: BlogImageProps) {
  return (
    <div className="flex flex-col gap-2 my-4">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        placeholder="blur"
        className="!my-0 rounded"
      />
      {caption && <p className="text-sm text-gray-500 !my-0">{caption}</p>}
    </div>
  );
}
