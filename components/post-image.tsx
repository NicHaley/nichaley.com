import Image, { ImageProps } from "next/image";

type InlineImageProps = ImageProps;

export default function PostImage({ src, alt }: InlineImageProps) {
  return (
    <div className="flex flex-col gap-2 mb-4 p-4 md:p-8 aspect-video bg-linear-to-t from-stone-200 to-stone-100  dark:from-stone-900 dark:to-stone-800 rounded items-center justify-center">
      <Image
        src={src}
        alt={alt ?? ""}
        className="!my-0 rounded w-auto h-auto max-w-full max-h-full object-contain drop-shadow-md"
      />
    </div>
  );
}
