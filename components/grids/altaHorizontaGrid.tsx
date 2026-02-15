"use client";

import React from "react";
import { ProductCardAltaHorizontal } from "@/components/Card/altaV2";
import { mockProducts } from "@/lib/mockData"; // the file we made

export default function MockAltaHorizontalGrid() {
  return (
    <div className="w-full max-w-[60%] mx-auto">
      <div className="flex flex-col gap-4">
        {mockProducts.map((p) => (
          <ProductCardAltaHorizontal key={p.id} product={p} lang="en" themeColor="#7A5AE0" size="compact" />
        ))}
      </div>
    </div>
    
  );
}