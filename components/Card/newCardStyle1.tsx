"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { cn, resolveImageUrl, formatPrice, isS3Url } from "@/lib/utils";
import { getTranslatedField } from "@/lib/entity-translations";
import type { ProductResponseModel } from "@/types/product";
import { getProductImageUrls } from "@/types/product";
import { StockStatus } from "@/types/enums";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HeartIcon, HeartOutlineIcon, ShuffleOutlineIcon } from "../icons";

type ProductCardProps = {
  product: ProductResponseModel;
  className?: string;
  priority?: boolean;
  size?: "default" | "compact";
  themeColor?: string;
  lang?: string;
  showActions?: boolean;
};

function ProductCardInner({
  product,
  className,
  priority = false,
  size = "default",
  themeColor = "#4b3dbd",
  lang = "en",
  showActions = true,
}: ProductCardProps) {
  const images = useMemo(
    () => getProductImageUrls(product.images),
    [product.images],
  );
  const imageUrl = resolveImageUrl(images[0] || "");
  const isInStock = product.status === StockStatus.InStock;

  const { hasDiscount, displayPrice, discountPercent } = useMemo(() => {
    const hasDisc =
      !!product.discountPrice && product.discountPrice < product.price;
    const disp = hasDisc ? product.discountPrice! : product.price;
    const pct = hasDisc
      ? Math.max(
          0,
          Math.round(
            ((product.price - product.discountPrice!) / product.price) * 100,
          ),
        )
      : 0;

    return { hasDiscount: hasDisc, displayPrice: disp, discountPercent: pct };
  }, [product.discountPrice, product.price]);

  const isCompact = size === "compact";

  const styles = useMemo(
    () => ({
      titleSize: isCompact ? "text-[15px]" : "text-[17px]",
      priceSize: isCompact ? "text-[15px]" : "text-[17px]",
      oldPriceSize: isCompact ? "text-[11px]" : "text-sm",
      footerPadding: isCompact ? "p-3.5 pt-3.5" : "p-4 pt-4",
      buttonHeight: isCompact ? "h-10" : "h-11",
      iconDimension: isCompact ? "h-4 w-4" : "h-[18px] w-[18px]",
      minTitleHeight: isCompact ? "min-h-[1.75rem]" : "min-h-[2.5rem]",
      discountBadge: isCompact
        ? "text-[10px] px-2 py-1"
        : "text-[11px] px-2.5 py-1",
      imgSizes: "(max-width:640px) 260px, (max-width:1024px) 260px, 260px",
    }),
    [isCompact],
  );

  const href = `/${lang}/product/${product.slug || product.id}`;

  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className={cn(
        "group relative flex h-full min-h-[300px] w-full min-w-[250px] max-w-[270px] cursor-pointer flex-col overflow-hidden",
        "rounded-[20px] border border-black/10 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1",
        className,
      )}
    >
      <meta
        content={getTranslatedField(
          product.translations,
          "Name",
          lang,
          product.name || "Product",
        )}
        itemProp="name"
      />

      {imageUrl && <meta content={imageUrl} itemProp="image" />}

      <Link
        aria-label={`View ${product.name || "product"} details`}
        className="absolute inset-0 z-0"
        href={href}
        tabIndex={-1}
      />

      <CardContent className="relative p-0">
        <div className="relative">
          <AspectRatio
            className="relative overflow-hidden rounded-t-[20px] bg-zinc-100"
            ratio={1.08}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-30 h-7 w-7 rounded-full bg-white/90
                                        backdrop-blur shadow-md flex items-center justify-center transition
                                        hover:scale-105 hover:shadow-lg active:scale-95 pointer-events-auto"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => alert("added to ?????")}
              disabled={!isInStock || product.isComingSoon}
            >
              <ShuffleOutlineIcon
                className={cn(styles.iconDimension, "text-black")}
              />
            </button>

            <button
              type="button"
              className="absolute right-3 top-12 z-30 h-7 w-7 rounded-full bg-white/90
                                        backdrop-blur shadow-md flex items-center justify-center transition
                                        hover:scale-105 hover:shadow-lg active:scale-95 pointer-events-auto"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => setIsFavorite((prev) => !prev)}
              disabled={!isInStock || product.isComingSoon}
            >
              {isFavorite ? (
                <HeartIcon
                  className={cn(styles.iconDimension, "text-red-500")}
                />
              ) : (
                <HeartOutlineIcon
                  className={cn(styles.iconDimension, "text-black")}
                />
              )}
            </button>

            {imageUrl ? (
              <Image
                fill
                alt={product.name || "Product image"}
                className="object-cover transition-opacity duration-300"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                sizes={styles.imgSizes}
                src={imageUrl}
                unoptimized={isS3Url(imageUrl)}
              />
            ) : (
              <div className="h-full w-full bg-zinc-200" />
            )}

            {/* Price layer */}
            <div
              className="absolute bottom-0 right-3 z-20 rounded-t-[10px] px-3.5 pt-1.5 pb-2 pointer-events-none flex flex-col items-end"
              style={{ backgroundColor: themeColor }}
            >
              <meta content="₾" itemProp="priceCurrency" />
              <meta content={displayPrice.toString()} itemProp="price" />
              <meta
                content={
                  isInStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
                }
                itemProp="availability"
              />

              {hasDiscount && (
                <span
                  className={cn(
                    styles.oldPriceSize,
                    "whitespace-nowrap line-through text-white/50",
                  )}
                >
                  {formatPrice(product.price)}
                </span>
              )}

              <span
                className={cn(
                  styles.priceSize,
                  "whitespace-nowrap font-extrabold text-white",
                )}
              >
                {formatPrice(displayPrice)}
              </span>
            </div>

            {discountPercent > 0 && (
              <div className="absolute left-3 top-3 z-20 pointer-events-none">
                <div
                  className={cn(
                    "rounded-full font-bold shadow-lg",
                    styles.discountBadge,
                  )}
                  style={{
                    backgroundColor: themeColor,
                    color: "white",
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  -{discountPercent}%
                </div>
              </div>
            )}
          </AspectRatio>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "relative pointer-events-none flex flex-1 flex-col items-start gap-3 bg-[#26222F] text-white",
          styles.footerPadding,
        )}
      >
        <h3
          className={cn(
            "w-full line-clamp-2 font-bold leading-snug",
            styles.titleSize,
            styles.minTitleHeight,
          )}
          itemProp="name"
        >
          {getTranslatedField(
            product.translations,
            "Name",
            lang,
            product.name || "Unnamed Product",
          )}
        </h3>

        <div className="mt-auto w-full">
          {showActions && (
            <div className="pointer-events-auto grid w-full grid-cols-2 gap-2">
              <Button
                className={cn(
                  styles.buttonHeight,
                  "w-full rounded-xl border border-white/20 bg-transparent font-semibold shadow-none",
                  "flex items-center justify-center gap-2 text-white transition-all",
                )}
                disabled={!isInStock || product.isComingSoon}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Add to cart:", product.id);
                }}
              >
                <ShoppingCart className={cn(styles.iconDimension)} />
                <span className="text-[14px] font-semibold">Cart</span>
              </Button>

              <Button
                className={cn(
                  styles.buttonHeight,
                  "w-full rounded-xl font-semibold shadow-none text-white transition-all hover:opacity-90",
                )}
                disabled={!isInStock || product.isComingSoon}
                style={{ backgroundColor: themeColor }}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  alert("ყიდვის ფეიჯზე გადასვლა");
                }}
              >
                <span className="text-[14px] font-semibold">
                  {lang === "ka" ? "ყიდვა" : "Buy"}
                </span>
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </article>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const ProductNewCardStyle1 = memo(ProductCardInner);
ProductNewCardStyle1.displayName = "ProductCard";
