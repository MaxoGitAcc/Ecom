import { BrandModel } from "./brand";
import { CategoryModel } from "./category";
import { StockStatus, Condition } from "./enums";
import { ProductFacetValueModel, ProductFacetValueResponseModel } from "./facet";


// Localized text for multi-language support
export type LocalizedText = Record<string, string> & {
  en: string;
  ka?: string;
};

// Entity translations: { "en": { "Name": "...", "Description": "..." }, "ka": { ... } }
export type EntityTranslations = Record<string, Record<string, string>>;


export interface ProductResponseModel {
  id: string;
  name?: string;
  sku?: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  isDiscountPercentage?: boolean;
  discountValue?: number;
  status: StockStatus;
  condition: Condition;
  description?: string;
  images?: ProductImageModel[];
  brand: BrandModel;
  category: CategoryModel;
  isActive?: boolean;
  isLiquidated?: boolean;
  isComingSoon?: boolean;
  isNewArrival?: boolean;
  productFacetValues: ProductFacetValueResponseModel[];
  productGroupId?: string;
  productAdditionalJson?: string; // JSON string containing ProductRailSectionData[]
  stockQuantity?: number; // Current stock quantity (if available from server)
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  translations?: EntityTranslations;
}


// Product Image model with cover support
export interface ProductImageModel {
  id: string;
  productId: string;
  imagePath: string;
  isCover: boolean;
  displayOrder: number;
}

// Helper functions to work with product images
// These functions handle both the new ProductImageModel[] format and legacy string[] format

type ImageInput = ProductImageModel[] | string[] | undefined;

/**
 * Check if the input is the new ProductImageModel[] format
 */
function isProductImageModelArray(images: ImageInput): images is ProductImageModel[] {
  if (!images || images.length === 0) return false;
  const first = images[0];

  return typeof first === 'object' && first !== null && 'imagePath' in first;
}

/**
 * Get sorted image URLs from ProductImageModel array or string array
 * @param images - Array of ProductImageModel, string array, or undefined
 * @returns Array of image URLs sorted by displayOrder (cover image first if no displayOrder)
 */
export function getProductImageUrls(images: ImageInput): string[] {
  if (!images || images.length === 0) return [];

  // Handle legacy string[] format
  if (!isProductImageModelArray(images)) {
    return images.filter(img => typeof img === 'string' && img.trim());
  }

  // Handle new ProductImageModel[] format
  const sorted = [...images].sort((a, b) => {
    // If displayOrder is set, use it
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    // Otherwise, cover image comes first
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;

    return 0;
  });

  return sorted.map(img => img.imagePath);
}

/**
 * Get the cover image URL from ProductImageModel array or string array
 * @param images - Array of ProductImageModel, string array, or undefined
 * @returns Cover image URL or first image URL, or undefined if no images
 */
export function getCoverImageUrl(images: ImageInput): string | undefined {
  if (!images || images.length === 0) return undefined;

  // Handle legacy string[] format
  if (!isProductImageModelArray(images)) {
    const first = images.find(img => typeof img === 'string' && img.trim());

    return first as string | undefined;
  }

  // Handle new ProductImageModel[] format
  const cover = images.find(img => img.isCover);

  if (cover) return cover.imagePath;

  // Fallback to first image by displayOrder
  const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  return sorted[0]?.imagePath;
}
