"use client";

import React from "react";
import { ProductCard2New } from "@/components/Card/newCardStyle2";
import { mockProducts } from "@/lib/mockData"; // the file we made

export default function MockNewStyle2Grid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockProducts.map((p) => (
        <ProductCard2New key={p.id} product={p} lang="en" themeColor="#7A5AE0" size="compact" />
      ))}
    </div>
  );
}