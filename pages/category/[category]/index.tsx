"use client"

import { useParams } from "next/navigation"
import ProductDisplay from "@/components/ProductDisplay"

export default function CategoryPage() {
  const params = useParams()
  const category = params?.category as string

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{category}</h1>
      {/* Pass category prop to ProductDisplay */}
      <ProductDisplay category={category} />
    </div>
  )
}
