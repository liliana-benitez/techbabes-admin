import { Product, ProductVariant } from "@/generated/prisma/client"

export type ProductWithVariants = Product & {
  variants: ProductVariant[]
}
