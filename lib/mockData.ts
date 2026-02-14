import { ProductResponseModel } from "../types/product";
import { StockStatus, Condition } from "../types/enums";
import { FacetTypeEnum } from "../types/enums";
import { BrandModel } from "../types/brand";
import { CategoryModel } from "../types/category";

const mockBrand: BrandModel = {
  id: "brand-1",
  name: "TechPro",
  slug: "techpro",
  origin: "USA",
  images: ["/brands/techpro.png"],
};

const mockCategory: CategoryModel = {
  id: "cat-1",
  name: "Graphics Cards",
  slug: "graphics-cards",
  facets: [
    {
      id: "facet-1",
      name: "Memory",
      displayType: FacetTypeEnum.CheckboxList,
      isCustom: false,
      facetValues: [
        { id: "fv-1", value: "8GB" },
        { id: "fv-2", value: "16GB" },
      ],
    },
    {
      id: "facet-2",
      name: "Brand",
      displayType: FacetTypeEnum.CheckboxList,
      isCustom: false,
      facetValues: [
        { id: "fv-3", value: "NVIDIA" },
        { id: "fv-4", value: "AMD" },
      ],
    },
  ],
};

export const mockProducts: ProductResponseModel[] = [
  {
    id: "prod-1",
    name: "RTX 5060 Ti 8GB",
    sku: "RTX5060TI-8",
    slug: "rtx-5060-ti-8gb",
    price: 1899,
    discountPrice: 1699,
    isDiscountPercentage: false,
    status: StockStatus.InStock,
    condition: Condition.New,
    description: "Great GPU for 1080p gaming and competitive FPS.",
    images: [
      {
        id: "img-1",
        productId: "prod-1",
        imagePath: "https://zoommer.ge/_next/image?url=https%3A%2F%2Fs3.zoommer.ge%2Fsite%2Fafee037f-679b-4740-af12-3082f7258c05_Thumb.jpeg&w=640&q=100",
        isCover: true,
        displayOrder: 1,
      },
      {
        id: "img-2",
        productId: "prod-1",
        imagePath: "https://zoommer.ge/_next/image?url=https%3A%2F%2Fs3.zoommer.ge%2Fsite%2F10feb990-4314-42cc-8da1-672f4685f1a1_Thumb.jpeg&w=640&q=100",
        isCover: false,
        displayOrder: 2,
      },
    ],
    brand: mockBrand,
    category: mockCategory,
    isActive: true,
    isNewArrival: true,
    stockQuantity: 12,
    productFacetValues: [
      { facetValueId: "fv-1", facetName: "Memory", facetValue: "8GB", isReachable: true, isSelected: true },
      { facetValueId: "fv-3", facetName: "Brand", facetValue: "NVIDIA", isReachable: true, isSelected: true },
    ],
  },

  {
    id: "prod-2",
    name: "RTX 5060 Ti 16GB",
    sku: "RTX5060TI-16",
    slug: "rtx-5060-ti-16gb",
    price: 2199,
    status: StockStatus.InStock,
    condition: Condition.New,
    description: "Same power, more VRAM for future-proofing.",
    images: [
      {
        id: "img-3",
        productId: "prod-2",
        imagePath: "https://zoommer.ge/_next/image?url=https%3A%2F%2Fs3.zoommer.ge%2Fsite%2Fe2abf992-3787-4434-b4d1-48c34bbd27ec_Thumb.jpeg&w=640&q=100",
        isCover: true,
        displayOrder: 1,
      },
    ],
    brand: mockBrand,
    category: mockCategory,
    isActive: true,
    stockQuantity: 7,
    productFacetValues: [
      { facetValueId: "fv-2", facetName: "Memory", facetValue: "16GB", isReachable: true, isSelected: true },
      { facetValueId: "fv-3", facetName: "Brand", facetValue: "NVIDIA", isReachable: true, isSelected: true },
    ],
  },

  {
    id: "prod-3",
    name: "RX 7800 XT 16GB",
    sku: "RX7800XT-16",
    slug: "rx-7800-xt-16gb",
    price: 2099,
    status: StockStatus.InStock,
    condition: Condition.New,
    description: "Powerful AMD GPU for 1440p gaming.",
    images: [
      {
        id: "img-4",
        productId: "prod-3",
        imagePath: "https://zoommer.ge/_next/image?url=https%3A%2F%2Fs3.zoommer.ge%2Fsite%2F73b4fd5b-64a4-411a-b24d-3ba0c53d0bbf_Thumb.jpeg&w=640&q=100",
        isCover: true,
        displayOrder: 1,
      },
    ],
    brand: {
      id: "brand-2",
      name: "RedForce",
      slug: "redforce",
      origin: "Taiwan",
      images: ["/brands/redforce.png"],
    },
    category: mockCategory,
    isActive: true,
    stockQuantity: 4,
    productFacetValues: [
      { facetValueId: "fv-2", facetName: "Memory", facetValue: "16GB", isReachable: true, isSelected: true },
      { facetValueId: "fv-4", facetName: "Brand", facetValue: "AMD", isReachable: true, isSelected: true },
    ],
  },

  {
    id: "prod-4",
    name: "GTX 1660 Super",
    sku: "GTX1660S",
    slug: "gtx-1660-super",
    price: 699,
    status: StockStatus.OutOfStock,
    condition: Condition.Used,
    description: "Budget option for esports titles.",
    images: [
      {
        id: "img-5",
        productId: "prod-4",
        imagePath: "https://zoommer.ge/_next/image?url=https%3A%2F%2Fs3.zoommer.ge%2Fsite%2F21e5445e-8433-42f6-8fb2-2fe20e43ac9d_Thumb.jpeg&w=640&q=100",
        isCover: true,
        displayOrder: 1,
      },
    ],
    brand: mockBrand,
    category: mockCategory,
    isActive: true,
    stockQuantity: 0,
    productFacetValues: [
      { facetValueId: "fv-1", facetName: "Memory", facetValue: "8GB", isReachable: false, isSelected: true },
      { facetValueId: "fv-3", facetName: "Brand", facetValue: "NVIDIA", isReachable: true, isSelected: true },
    ],
  },

  {
    id: "prod-5",
    name: "RX 6600 8GB",
    sku: "RX6600-8",
    slug: "rx-6600-8gb",
    price: 799,
    discountPrice: 699,
    isDiscountPercentage: false,
    status: StockStatus.InStock,
    condition: Condition.New,
    description: "Great value GPU for 1080p gaming.",
    images: [
      {
        id: "img-6",
        productId: "prod-5",
        imagePath: "https://zoommer.ge/_next/image?url=https%3A%2F%2Fs3.zoommer.ge%2Fsite%2Fdfd86cf1-3b7d-4116-a4c7-a144c3520945_Thumb.jpeg&w=384&q=100",
        isCover: true,
        displayOrder: 1,
      },
    ],
    brand: {
      id: "brand-2",
      name: "RedForce",
      slug: "redforce",
      origin: "Taiwan",
      images: ["/brands/redforce.png"],
    },
    category: mockCategory,
    isActive: true,
    stockQuantity: 9,
    productFacetValues: [
      { facetValueId: "fv-1", facetName: "Memory", facetValue: "8GB", isReachable: true, isSelected: true },
      { facetValueId: "fv-4", facetName: "Brand", facetValue: "AMD", isReachable: true, isSelected: true },
    ],
  },
];
