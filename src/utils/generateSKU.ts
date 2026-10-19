import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

export const generateSKU = (
  title: string,
  sizeId?: string,
  colorId?: string
) => {
  const cleanTitle = slugify(title, {
    lower: true,
    strict: true,
  });

  const shortId = uuidv4().split("-")[0];

  return [
    cleanTitle,
    sizeId || "na",
    colorId || "na",
    shortId,
  ]
    .join("-")
    .toUpperCase();
};