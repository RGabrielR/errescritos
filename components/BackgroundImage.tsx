import { useEffect, useRef } from "react";

export const BackgroundImage = ({ image, blurValue }: { image: string, blurValue: number }) =>
{
    const imageRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (imageRef.current) {
        imageRef.current.style.backgroundImage = `url(${image})`;
        imageRef.current.style.filter = `blur(${blurValue}px)`;
      }
    }, [image, blurValue]);
  
    return (
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-in-out"
        ref={imageRef}
      />
    );
  };