import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/utils";

const NOISE_PARAMS = ["search", "min_price", "max_price", "variation_tags", "per_page"].map((p) => `/*?*${p}=`);
const AGGRESSIVE_BOTS = ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "PetalBot", "Bytespider", "GPTBot", "CCBot", "ClaudeBot", "Amazonbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", "/_next/", "/static/", ...NOISE_PARAMS],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", ...NOISE_PARAMS],
      },
      { userAgent: AGGRESSIVE_BOTS, disallow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
