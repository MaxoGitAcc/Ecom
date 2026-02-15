/* eslint-disable @typescript-eslint/no-unused-vars */
import { Locale } from "@/i18n.config";
import MockProductsGrid from "@/components/grids/mockProductGrid";
import MockZoommerGrid from "@/components/grids/zoommerGrid";
import MockAltaGrid from "@/components/grids/altaGrid";
import MockAltaHorizontalGrid from "@/components/grids/altaHorizontaGrid";


export default function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <MockProductsGrid /> */}
      <MockZoommerGrid />
      <MockAltaGrid />
      <MockAltaHorizontalGrid />
    </section>
  );
}
