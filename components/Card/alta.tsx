"use client"; // Tells Next.js this component must run on the client (uses hooks & events)

import React, { memo, useMemo } from "react"; // React core + memo (optimize re-renders) + useMemo (cache calculations)
import Link from "next/link"; // Next.js client-side navigation
import Image from "next/image"; // Next.js optimized image component
import { Ghost, ShoppingCart } from "lucide-react"; // Icon component

import { cn, resolveImageUrl, formatPrice, isS3Url } from "@/lib/utils";
// cn = className helper, resolveImageUrl = normalize image URLs, 
// formatPrice = format currency, isS3Url = detect S3 image URLs

import { getTranslatedField } from "@/lib/entity-translations";
// Helper to get translated text (e.g. product name in different languages)

import type { ProductResponseModel } from "@/types/product";
// Type for product object

import { getProductImageUrls } from "@/types/product";
// Extracts array of image URLs from product model

import { StockStatus } from "@/types/enums";
// Enum for product stock status (InStock, OutOfStock, etc.)

// shadcn/ui components (UI primitives)
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HeartIcon, HeartOutlineIcon, ShuffleOutlineIcon } from "../icons";

// Props type definition
type ProductCardProps = {
    product: ProductResponseModel;   // Product data (price, images, translations, etc.)
    className?: string;              // Extra classes from parent
    priority?: boolean;              // Next/Image priority loading flag
    size?: "default" | "compact";    // Card layout size
    /** pass theme color from your tenant or default */
    themeColor?: string;             // Accent color for price, button, badge
    /** pass current language */
    lang?: string;                   // Current language code
    /** if you want to hide button */
    showActions?: boolean;           // Show/hide action buttons
};

function ProductCardInner({
    product,
    className,
    priority = false,                // Default: image not priority-loaded
    size = "default",                // Default card size
    themeColor = "#000000",          // Default theme color
    lang = "en",                     // Default language
    showActions = true,              // Show button by default
}: ProductCardProps) {

    // Memoized extraction of product image URLs
    const images = useMemo(() => getProductImageUrls(product.images), [product.images]);

    // Resolve first image URL (CDN/S3/relative path handling)
    const imageUrl = resolveImageUrl(images[0] || "");

    // Check if product is in stock
    const isInStock = product.status === StockStatus.InStock;

    // Memoized discount calculation logic
    const { hasDiscount, displayPrice, discountPercent } = useMemo(() => {
        const hasDisc = !!product.discountPrice && product.discountPrice < product.price; // Is discounted?
        const disp = hasDisc ? product.discountPrice! : product.price; // Which price to display
        const pct = hasDisc
            ? Math.max(
                0,
                Math.round(((product.price - product.discountPrice!) / product.price) * 100)
            )
            : 0; // Calculate discount percent

        return { hasDiscount: hasDisc, displayPrice: disp, discountPercent: pct };
    }, [product.discountPrice, product.price]);

    // Compact layout flag
    const isCompact = size === "compact";

    // Memoized style variants based on layout size
    const styles = useMemo(
        () => ({
            titleSize: isCompact ? "text-[16px] sm:text-[15px]" : "text-[17px]",
            priceSize: isCompact ? "text-sm sm:text-base" : "text-xl",
            oldPriceSize: isCompact ? "text-[11px] sm:text-xs" : "text-sm",
            footerPadding: isCompact ? "p-2.5" : "p-4",
            addBtnHeight: isCompact ? "h-9" : "h-11",
            iconDimension: isCompact ? "h-3.5 w-3.5" : "h-4 w-4",
            minTitleHeight: isCompact ? "min-h-[1.75rem]" : "min-h-[2.5rem]",
            discountBadge: isCompact ? "text-[9px] px-1.5 py-[2px]" : "text-xs px-2.5 py-1",
            imgSizes: "(max-width:640px) 230px, (max-width:1024px) 230px, 230px",
        }),
        [isCompact]
    );

    // Product page URL
    const href = `/${lang}/product/${product.slug || product.id}`;

    const [isFavorite, setIsFavorite] = React.useState(false);

    return (
        <article
            itemScope
            itemType="https://schema.org/Product" // SEO structured data
            className={cn(
                "group relative overflow-hidden transition-all duration-300 flex flex-col h-full",
                "rounded-2xl border bg-white border-black/10 dark:bg-zinc-950 dark:border-white/10",
                className
            )}
        >

            {/* hover */}
            <div className=" pointer-events-none absolute inset-0 z-20 rounded-2xl
                        opacity-0 group-hover:opacity-80
                        transition-opacity duration-300
                        shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]
                        dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]"/>

            {/* SEO meta for product name */}
            <meta content={getTranslatedField(product.translations, "Name", lang, product.name || "Product")} itemProp="name" />

            {/* SEO meta for product image */}
            {imageUrl && <meta content={imageUrl} itemProp="image" />}

            {/* Full-card clickable overlay link */}
            <Link
                aria-label={`View ${product.name || "product"} details`}
                className="absolute inset-0 z-0"
                href={href}
                tabIndex={-1}
            />

            {/* IMAGE SECTION */}
            <CardContent className="p-0 relative">
                <div className="relative">
                    <AspectRatio
                        className="overflow-hidden bg-zinc-100 dark:bg-zinc-900/60 rounded-t-2xl relative"
                        ratio={1}>

                        <button type="button" className="absolute right-3 top-3 z-30 h-7 w-7 rounded-full bg-white/90
                            backdrop-blur shadow-md flex items-center justify-center transition
                            hover:scale-105 hover:shadow-lg active:scale-95 pointer-events-auto"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none"
                            }}
                            onClick={() => alert("added to ?????")}
                            disabled={!isInStock || product.isComingSoon}>
                                <ShuffleOutlineIcon className={cn(styles.iconDimension, "text-black")} />
                        </button>

                        <button type="button" className="absolute right-3 top-12 z-30 h-7 w-7 rounded-full bg-white/90
                            backdrop-blur shadow-md flex items-center justify-center transition
                            hover:scale-105 hover:shadow-lg active:scale-95 pointer-events-auto"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none"
                            }}
                            onClick={() => setIsFavorite(prev => !prev)}
                            disabled={!isInStock || product.isComingSoon}>
                                {isFavorite ? (
                                    <HeartIcon className={cn(styles.iconDimension, "text-red-500")} />
                                ) : (
                                    <HeartOutlineIcon className={cn(styles.iconDimension, "text-black")} />
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
                                unoptimized={isS3Url(imageUrl)} // Disable optimization for S3 images
                            />
                        ) : (
                            <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800" />
                        )}

                        {/* Discount badge */}
                        {discountPercent > 0 && (
                            <div className="absolute left-3 top-3 pointer-events-none z-20">
                                <div
                                    className={cn("rounded-full font-bold shadow-lg", styles.discountBadge)}
                                    style={{
                                        backgroundColor: themeColor,
                                        color: "white",
                                        textShadow: "0 1px 2px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.9)",
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

            {/* CONTENT SECTION */}
            <CardFooter className={cn("relative pointer-events-none flex flex-col items-start gap-3 flex-1", styles.footerPadding)}>
                {/* Product title */}
                <h3
                    className={cn(
                        "font-bold leading-snug",
                        styles.titleSize,
                        "font-heading text-zinc-900 dark:text-zinc-100 w-full",
                        styles.minTitleHeight,
                        "line-clamp-2"
                    )}
                    itemProp="name"
                >
                    {getTranslatedField(product.translations, "Name", lang, product.name || "Unnamed Product")}
                </h3>


                {/* Price row */}
                <div
                    itemScope
                    className="flex items-baseline gap-2 w-full flex-wrap"
                    itemProp="offers"
                    itemType="https://schema.org/Offer"
                >
                    <meta content="₾" itemProp="priceCurrency" />
                    <meta content={displayPrice.toString()} itemProp="price" />
                    <meta
                        content={isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
                        itemProp="availability"
                    />

                    <span
                        className={cn(styles.priceSize, "font-primary font-extrabold whitespace-nowrap")}
                        style={{ color: themeColor }}
                    >
                        {formatPrice(displayPrice)}
                    </span>

                    {/* Old price shown only when discounted */}
                    {hasDiscount && (
                        <span
                            className={cn(
                                styles.oldPriceSize,
                                "font-primary line-through whitespace-nowrap opacity-60 text-muted-foreground dark:text-zinc-400"
                            )}
                        >
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                <div className="mt-auto w-full space-y-2.5">
                    {/* Action button */}
                    {showActions && (
                        <div className="w-full flex items-stretch gap-2 pointer-events-auto">
                            <Button
                                className="bg-white/90 hover:bg-white hover:shadow-md text-black shadow-sm w-10 rounded-full p-0 flex items-center justify-center"
                                disabled={!isInStock || product.isComingSoon} // Disable if out of stock or coming soon
                                type="button"
                                onClick={(e: { preventDefault: () => void; stopPropagation: () => void; }) => {
                                    e.preventDefault();   // Prevent navigation (Link)
                                    e.stopPropagation();  // Prevent card click
                                    // mock button action
                                    console.log("Add to cart:", product.id);
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 0 14px ${themeColor}CC`
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none"
                                }}
                            >
                                <ShoppingCart className={cn(styles.iconDimension)} />
                            </Button>
                            <Button
                                className={cn(
                                    styles.addBtnHeight,
                                    "w-[130px] rounded-2xl font-semibold shadow-md flex items-center justify-center gap-2 text-white transition-all",
                                    "hover:opacity-90",
                                )}
                                disabled={!isInStock || product.isComingSoon} // Disable if out of stock or coming soon
                                style={{ backgroundColor: themeColor }}
                                type="button"
                                onClick={() => alert('ყიდვის ფეიჯზე გადასვლა')} // Mock buy action
                            >
                                <span className="font-primary">
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
export const ProductCardAlta = memo(ProductCardInner);
ProductCardAlta.displayName = "ProductCard";
