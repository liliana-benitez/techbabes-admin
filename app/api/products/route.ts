import { createNewProduct } from "@/lib/db/product-repository"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      category,
      price,
      images,
      variants,
      printfulSyncId
    } = await request.json()

    // Validation
    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !images ||
      !variants ||
      !printfulSyncId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, description, category, price, printfulSyncId, images, variants"
        },
        { status: 400 }
      )
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        {
          error: "At least one image is required"
        },
        { status: 400 }
      )
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        {
          error: "At least one variant is required"
        },
        { status: 400 }
      )
    }

    const validCategories = ["CLOTHING", "HATS", "ACCESSORIES", "MUGS"]
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${validCategories.join(
            ", "
          )}`
        },
        { status: 400 }
      )
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        {
          error: "Price must be a positive number"
        },
        { status: 400 }
      )
    }

    // Validate variants
    for (const variant of variants) {
      if (
        !variant.printfulVariantId ||
        typeof variant.printfulVariantId !== "number"
      ) {
        return NextResponse.json(
          {
            error: "Each variant must have a valid printfulVariantId"
          },
          { status: 400 }
        )
      }
      if (
        !variant.price ||
        typeof variant.price !== "number" ||
        variant.price < 0
      ) {
        return NextResponse.json(
          {
            error: "Each variant must have a valid price"
          },
          { status: 400 }
        )
      }
    }

    const product = await createNewProduct({
      name,
      description,
      category,
      price,
      images,
      variants,
      printfulSyncId: parseInt(printfulSyncId)
    })

    return NextResponse.json(
      {
        success: true,
        data: product
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating product:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: "Internal server error"
      },
      { status: 500 }
    )
  }
}
