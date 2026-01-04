import { Prisma, ProductCategory } from "@/generated/prisma/client"
import { prisma } from "../prisma"

interface CreateProductInput {
  name: string
  description: string
  category: "CLOTHING" | "HATS" | "ACCESSORIES" | "MUGS"
  price: number
  printfulSyncId: number
  images: string[]
  variants: Array<{
    size: string | null
    color: string | null
    printfulVariantId: number
    price: number
  }>
}

export async function createNewProduct(input: CreateProductInput) {
  const {
    name,
    description,
    category,
    price,
    printfulSyncId,
    images,
    variants
  } = input

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category: category as ProductCategory,
        price,
        printfulSyncId,
        images,
        variants: {
          create: variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            printfulVariantId: variant.printfulVariantId,
            price: variant.price
          }))
        }
      }
    })

    const productWithVariants = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        variants: true
      }
    })

    return productWithVariants
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(`A product with this printful sync ID already exists`)
      }
    }
    throw error
  }
}
