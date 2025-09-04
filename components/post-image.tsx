import Image, { ImageProps } from "next/image";

type InlineImageProps = ImageProps;

export default function PostImage({ src, alt }: InlineImageProps) {
  return (
    <div className="flex flex-col gap-2 mb-4 p-8 aspect-video bg-stone-200 dark:bg-stone-700 rounded items-center justify-center">
      <Image
        src={src}
        alt={alt ?? ""}
        // placeholder="blur"
        width={100}
        height={100}
        className="!my-0 object-cover rounded"
      />
    </div>
  );
}
