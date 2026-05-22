import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/store/marketplace";

type LoadingImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export function LoadingImage({
  wrapperClassName,
  className,
  src,
  onLoad,
  onError,
  ...props
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const beginImageLoading = useMarketplace((state) => state.beginImageLoading);
  const endImageLoading = useMarketplace((state) => state.endImageLoading);
  const imageRef = useRef<HTMLImageElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    finishedRef.current = false;
    setLoaded(false);
    beginImageLoading();

    requestAnimationFrame(() => {
      const image = imageRef.current;
      if (image?.complete && image.naturalWidth > 0) {
        finishLoading();
      }
    });

    return () => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        endImageLoading();
      }
    };
  }, [beginImageLoading, endImageLoading, src]);

  const finishLoading = () => {
    setLoaded(true);
    if (!finishedRef.current) {
      finishedRef.current = true;
      endImageLoading();
    }
  };

  return (
    <span className={cn("relative block overflow-hidden bg-secondary/40", wrapperClassName)}>
      <img
        {...props}
        ref={imageRef}
        src={src}
        onLoad={(event) => {
          finishLoading();
          onLoad?.(event);
        }}
        onError={(event) => {
          finishLoading();
          onError?.(event);
        }}
        className={cn("transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0", className)}
      />
    </span>
  );
}
