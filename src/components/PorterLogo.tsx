import Image from "next/image";

interface PorterLogoProps {
  size?: number;
  variant?: "white" | "blue" | "black";
  className?: string;
}

export default function PorterLogo({ size = 24, variant = "blue", className = "" }: PorterLogoProps) {
  const src = {
    white: "/p-white.png",
    blue: "/p-bleu.png",
    black: "/p-black.png",
  }[variant];

  return (
    <Image
      src={src}
      alt="Porter logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
