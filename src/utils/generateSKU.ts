import { randomUUID } from "node:crypto";
import slugify from "slugify";

export const generateSKU = (
  title: string,
  sizeId?: string,
  colorId?: string
): string => {
  const cleanTitle = slugify(title, {
    lower: true,
    strict: true,
  });

  const shortId = randomUUID().split("-")[0];

  return [
    cleanTitle,
    sizeId || "na",
    colorId || "na",
    shortId,
  ]
    .join("-")
    .toUpperCase();
};