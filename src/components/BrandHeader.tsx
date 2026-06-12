import Link from "next/link";
import { site } from "@/config/site";
import { EyeScanIcon } from "./icons";

/** Ichki sahifalar tepasidagi bir qatorli logotip */
export function BrandHeader() {
  return (
    <Link href="/" className="relative block text-center">
      <span className="text-lg font-extrabold tracking-wide">
        {site.brand}{" "}
      </span>
      <span className="bracketed mx-1 text-lg font-extrabold">
        <EyeScanIcon className="mb-0.5 mr-0.5 inline h-4 w-4 align-middle" />
        {site.bracketWord}
      </span>
      <span className="text-lg font-extrabold">tekshiruvi</span>
    </Link>
  );
}
