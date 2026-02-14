"use client";

import React from "react";
import { ProductCardV2 } from "@/components/Card/zoommer";
import { mockProducts } from "@/lib/mockData"; // the file we made

export default function MockZoommerGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockProducts.map((p) => (
        <ProductCardV2 key={p.id} product={p} lang="en" themeColor="#CC6A4C" size="compact" />
      ))}
    </div>
  );
}