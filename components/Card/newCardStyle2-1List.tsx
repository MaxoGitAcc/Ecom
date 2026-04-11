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
  const imgSize = isCompact ? 150 : 190;
  const href = `/${lang}/product/${product.slug || product.id}`;
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className={cn(
        "group relative flex w-full cursor-pointer overflow-hidden",
        "rounded-[20px] border border-black/10 bg-white shadow-sm",
        "transition-transform duration-200 hover:-translate-y-0.5",
        className,
      )}
      style={{ minHeight: `${imgSize}px` }}
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
      <div
        className="relative shrink-0 overflow-hidden rounded-r-[20px] bg-zinc-100"
        style={{
          width: `${imgSize}px`,
          minWidth: `${imgSize}px`,
          alignSelf: "stretch",
          minHeight: `${imgSize}px`,
        }}
      >
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

        {/* action buttons on image */}
        <div className="absolute right-2 top-2 z-30 flex flex-col gap-1.5 pointer-events-auto">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md transition hover:scale-105 active:scale-95"
            disabled={!isInStock || product.isComingSoon}
            type="button"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 10px ${themeColor}CC`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <ShuffleOutlineIcon className="h-3.5 w-3.5 text-black" />
          </button>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md transition hover:scale-105 active:scale-95"
            disabled={!isInStock || product.isComingSoon}
            type="button"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 10px ${themeColor}CC`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsFavorite((prev) => !prev); }}
          >
            {isFavorite
              ? <HeartIcon className="h-3.5 w-3.5 text-red-500" />
              : <HeartOutlineIcon className="h-3.5 w-3.5 text-black" />}
          </button>
        </div>

        {imageUrl ? (
          <Image
            fill
            alt={product.name || "Product image"}
            className="object-cover"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes={`${imgSize}px`}
            src={imageUrl}
            unoptimized={isS3Url(imageUrl)}
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">

        {/* TOP: title + price */}
        <div className="flex items-start justify-between gap-4">
          <h3
            className="line-clamp-2 flex-1 text-[15px] font-bold leading-snug text-zinc-900"
            itemProp="name"
          >
            {getTranslatedField(product.translations, "Name", lang, product.name || "Unnamed Product")}
          </h3>

          {/* price top-right */}
          <div className="flex shrink-0 flex-col items-end">
            <meta content="₾" itemProp="priceCurrency" />
            <meta content={displayPrice.toString()} itemProp="price" />
            <meta
              content={isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
              itemProp="availability"
            />
            <span
              className="whitespace-nowrap text-[18px] font-extrabold"
              style={{ color: themeColor }}
            >
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="whitespace-nowrap text-[12px] text-zinc-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* stock status */}
        <div
          className="mt-2 text-[12px] font-medium"
          style={{ color: isInStock ? "#16a34a" : "#dc2626" }}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </div>

        {/* BOTTOM: buttons bottom-right */}
        {showActions && (
          <div className="mt-auto flex justify-end gap-2 pt-3 pointer-events-auto">
            <Button
              className="h-9 rounded-xl border border-zinc-200 bg-transparent px-4 text-[13px] font-semibold text-zinc-800 shadow-none flex items-center gap-1.5 hover:bg-zinc-50"
              disabled={!isInStock || product.isComingSoon}
              type="button"
              onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Cart
            </Button>

            <Button
              className="h-9 rounded-xl px-5 text-[13px] font-semibold text-white shadow-none hover:opacity-90"
              disabled={!isInStock || product.isComingSoon}
              style={{ backgroundColor: themeColor }}
              type="button"
              onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); alert("ყიდვის ფეიჯზე გადასვლა"); }}
            >
              {lang === "ka" ? "ყიდვა" : "Buy"}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export const ProductCardList = memo(ProductCardListInner);
ProductCardList.displayName = "ProductCardList";