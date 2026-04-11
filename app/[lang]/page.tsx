/* eslint-disable @typescript-eslint/no-unused-vars */
import { Locale } from "@/i18n.config";
import MockProductsGrid from "@/components/grids/mockProductGrid";
import MockZoommerGrid from "@/components/grids/zoommerGrid";
import MockAltaGrid from "@/components/grids/altaGrid";
import MockAltaHorizontalGrid from "@/components/grids/altaHorizontaGrid";
import MockNewCard1ProductsGrid from "@/components/grids/newCardStyle1Grid";
import MockNewStyle2Grid from "@/components/grids/newCardStyle2Grid";
import ProductCardListGrid from "@/components/grids/newCardStyle1-2ListGrid";
import ProductCardListGrid2 from "@/components/grids/newCardStyle2-1ListGrid";


export default function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <MockProductsGrid /> */}
      {/* <MockZoommerGrid /> */}
      {/*  */}
      {/* <MockAltaHorizontalGrid /> */}
      <MockNewCard1ProductsGrid />
      <MockNewStyle2Grid />
      <ProductCardListGrid />
      <ProductCardListGrid2 />
    </section>
  );
}
