"use client";

import Image from "next/image";
import { useState } from "react";

type FaviconProps = {
	src: string;
	alt: string;
	size?: number;
	className?: string;
};

export default function Favicon({
	src,
	alt,
	size = 16,
	className,
}: FaviconProps) {
	const [hasError, setHasError] = useState(false);

	if (hasError || !src) {
		return (
			<div
				role="img"
				aria-label={alt}
				className={`inline-block rounded bg-stone-200 ${className ?? ""}`}
				style={{ width: size, height: size }}
			/>
		);
	}

	return (
		<Image
			src={src}
			alt={alt}
			width={size}
			height={size}
			onError={() => setHasError(true)}
			className={className}
		/>
	);
}
