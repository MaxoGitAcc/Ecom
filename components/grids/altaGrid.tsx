"use client";

import React from "react";
import { ProductCardAlta } from "@/components/Card/alta";
import { mockProducts } from "@/lib/mockData"; // the file we made

export default function MockaltaGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockProducts.map((p) => (
        <ProductCardAlta key={p.id} product={p} lang="en" themeColor="#7A5AE0" size="compact" />
      ))}
    </div>
  );
}