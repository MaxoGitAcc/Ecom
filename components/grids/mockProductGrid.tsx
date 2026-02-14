"use client";

import React from "react";
import { ProductCard } from "@/components/Card/temp1";
import { mockProducts } from "@/lib/mockData"; // the file we made

export default function MockProductsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockProducts.map((p) => (
        <ProductCard key={p.id} product={p} lang="en" themeColor="#0f172a" size="compact" />
      ))}
    </div>
  );
}