"use client";

import React from "react";
import { ProductNewCardStyle1 } from "@/components/Card/newCardStyle1"; // the new card component we made
import { mockProducts } from "@/lib/mockData"; // the file we made

export default function MockNewCard1ProductsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockProducts.map((p) => (
        <ProductNewCardStyle1 key={p.id} product={p} lang="en" themeColor="#0f172a" size="compact" />
      ))}
    </div>
  );
}