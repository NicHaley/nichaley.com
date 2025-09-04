import Image from "next/image";

interface InlineImageProps {
  src: string;
  alt: string;
  caption: string;
}

export default function InlineImage({ src, alt, caption }: InlineImageProps) {
  return (
    <div className="flex flex-col gap-2 my-4 max-md:-mx-4">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        className="!my-0 object-cover max-h-[500px] md:rounded"
      />
      {caption && (
        <p className="text-sm text-gray-500 !my-0 max-md:mx-4">{caption}</p>
      )}
    </div>
  );
}
