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

import { Button } from "@/components/ui/button";
import { HeartIcon, HeartOutlineIcon, ShuffleOutlineIcon } from "../icons";

type ProductCardListProps = {
  product: ProductResponseModel;
  className?: string;
  priority?: boolean;
  size?: "default" | "compact";
  themeColor?: string;
  lang?: string;
  showActions?: boolean;
};

function ProductCardListInner({
  product,
  className,
  priority = false,
  size = "default",
  themeColor = "#4b3dbd",
  lang = "en",
  showActions = true,
}: ProductCardListProps) {
  const images = useMemo(() => getProductImageUrls(product.images), [product.images]);
  const imageUrl = resolveImageUrl(images[0] || "");
  const isInStock = product.status === StockStatus.InStock;

  const { hasDiscount, displayPrice, discountPercent } = useMemo(() => {
    const hasDisc = !!product.discountPrice && product.discountPrice < product.price;
    const disp = hasDisc ? product.discountPrice! : product.price;
    const pct = hasDisc
      ? Math.max(0, Math.round(((product.price - product.discountPrice!) / product.price) * 100))
      : 0;

    return { hasDiscount: hasDisc, displayPrice: disp, discountPercent: pct };
  }, [product.discountPrice, product.price]);

  const isCompact = size === "compact";
  const imgWidth = isCompact ? "w-[130px] min-w-[130px]" : "w-[160px] min-w-[160px]";
  const minHeight = isCompact ? "min-h-[130px]" : "min-h-[160px]";
  const href = `/${lang}/product/${product.slug || product.id}`;
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className={cn(
        "group relative flex w-full overflow-hidden cursor-pointer",
        "rounded-[20px] border border-black/10 bg-[#26222F] shadow-sm",
        "transition-transform duration-200 hover:-translate-y-0.5",
        minHeight,
        className,
      )}
    >
      <meta
        content={getTranslatedField(product.translations, "Name", lang, product.name || "Product")}
        itemProp="name"
      />
      {imageUrl && <meta content={imageUrl} itemProp="image" />}

      <Link
        aria-label={`View ${product.name || "product"} details`}
        className="absolute inset-0 z-0"
        href={href}
        tabIndex={-1}
      />

      {/* IMAGE */}
      <div className={cn("relative self-stretch shrink-0 overflow-hidden rounded-r-[20px] bg-zinc-100", imgWidth)}>

        {discountPercent > 0 && (
          <div className="absolute left-3 top-3 z-20 pointer-events-none">
            <div
              className="rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm"
              style={{ backgroundColor: themeColor, color: "white" }}
            >
              -{discountPercent}%
            </div>
          </div>
        )}

        <div
          className="absolute bottom-0 right-0 z-20 rounded-tl-[10px] px-3 pt-1.5 pb-2 pointer-events-none flex flex-col items-end"
          style={{ backgroundColor: themeColor }}
        >
          <meta content="₾" itemProp="priceCurrency" />
          <meta content={displayPrice.toString()} itemProp="price" />
          <meta
            content={isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
            itemProp="availability"
          />
          {hasDiscount && (
            <span className="whitespace-nowrap text-[10px] text-white/50 line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="whitespace-nowrap text-[14px] font-extrabold text-white">
            {formatPrice(displayPrice)}
          </span>
        </div>

        {imageUrl ? (
          <Image
            fill
            alt={product.name || "Product image"}
            className="object-cover"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes={isCompact ? "130px" : "160px"}
            src={imageUrl}
            unoptimized={isS3Url(imageUrl)}
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <h3
          className="line-clamp-3 text-[15px] font-bold leading-snug text-white"
          itemProp="name"
        >
          {getTranslatedField(product.translations, "Name", lang, product.name || "Unnamed Product")}
        </h3>

        <div
          className="mt-2 text-[12px] font-medium"
          style={{ color: isInStock ? "#4ade80" : "#f87171" }}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* RIGHT: action buttons */}
      {showActions && (
        <div className="flex shrink-0 flex-col items-center justify-center gap-3 px-4 pointer-events-auto">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-md transition hover:scale-105 active:scale-95"
            disabled={!isInStock || product.isComingSoon}
            type="button"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <ShuffleOutlineIcon className="h-4 w-4 text-white" />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-md transition hover:scale-105 active:scale-95"
            disabled={!isInStock || product.isComingSoon}
            type="button"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsFavorite((prev) => !prev); }}
          >
            {isFavorite
              ? <HeartIcon className="h-4 w-4 text-red-500" />
              : <HeartOutlineIcon className="h-4 w-4 text-white" />}
          </button>

          <Button
            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md text-white transition hover:scale-105 hover:opacity-90 active:scale-95"
            disabled={!isInStock || product.isComingSoon}
            style={{ backgroundColor: themeColor }}
            type="button"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px ${themeColor}CC`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      )}
    </article>
  );
}

export const ProductCardList = memo(ProductCardListInner);
ProductCardList.displayName = "ProductCardList";