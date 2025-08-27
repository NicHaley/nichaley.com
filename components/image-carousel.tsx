"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ImageCarouselProps = {
  images: string[];
  className?: string;
  imageClassName?: string;
  aspectRatioClassName?: string;
};

export default function ImageCarousel({
  images,
  className,
  imageClassName,
  aspectRatioClassName = "aspect-[16/9]",
}: ImageCarouselProps) {
  if (!images || images.length === 0) return null;

  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={`${src}-${index}`}>
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-md bg-stone-100",
                aspectRatioClassName
              )}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0}
                className={cn("object-cover", imageClassName)}
                style={{ margin: 0 }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
