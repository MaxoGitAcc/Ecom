import { FacetModel } from "./facet";
import type { EntityTranslations } from "./product";

export interface CategoryImageModel {
  id: string;
  categoryId: string;
  imagePath: string;
  isCover: boolean;
  displayOrder: number;
}

export interface CategoryModel {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  images?: string[];
  facets: FacetModel[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  translations?: EntityTranslations;
}

export function getCategoryCoverImageUrl(images: string[] | undefined): string | undefined {
  if (!images || images.length === 0) return undefined;

  return images[0];
}
