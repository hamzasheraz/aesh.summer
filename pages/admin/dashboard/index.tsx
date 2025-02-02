"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../components/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for demonstration
const mockOrders = [
  { id: 1, customer: "John Doe", total: 99.99, status: "Completed" },
  { id: 2, customer: "Jane Smith", total: 149.99, status: "Processing" },
  { id: 3, customer: "Bob Johnson", total: 79.99, status: "Shipped" },
]

const mockProducts = [
  { id: 1, name: "Summer Dress", price: 49.99, quantity: 50, type: "Dresses" },
  { id: 2, name: "Beach Hat", price: 24.99, quantity: 100, type: "Accessories" },
  { id: 3, name: "Sunglasses", price: 39.99, quantity: 75, type: "Accessories" },
]

const mockProductTypes = ["Dresses", "Tops", "Bottoms", "Swimwear", "Accessories"]

export default function AdminDashboard() {
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [products, setProducts] = useState(mockProducts)
  const [productTypes, setProductTypes] = useState(mockProductTypes)
  const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "", type: "" })
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProductType, setNewProductType] = useState("")
  const [editingProductType, setEditingProductType] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        if (!isLoggedIn) {
          router.push("/admin/login")
        }
      } catch (err) {
        setError("An error occurred while checking authentication.")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [isLoggedIn, router])

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.quantity && newProduct.type) {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          name: newProduct.name,
          price: Number.parseFloat(newProduct.price),
          quantity: Number.parseInt(newProduct.quantity),
          type: newProduct.type,
        },
      ])
      setNewProduct({ name: "", price: "", quantity: "", type: "" })
    }
  }

  const handleEditProduct = () => {
    if (editingProduct) {
      setProducts(products.map((product) => (product.id === editingProduct.id ? editingProduct : product)))
      setEditingProduct(null)
    }
  }

  const handleRemoveProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleAddProductType = () => {
    if (newProductType && !productTypes.includes(newProductType)) {
      setProductTypes([...productTypes, newProductType])
      setNewProductType("")
    }
  }

  const handleEditProductType = () => {
    if (editingProductType) {
      setProductTypes(
        productTypes.map((type) => (type === editingProductType.oldName ? editingProductType.newName : type)),
      )
      setEditingProductType(null)
    }
  }

  const handleRemoveProductType = (type) => {
    setProductTypes(productTypes.filter((t) => t !== type))
  }

  const handleChangeOrderStatus = (id, newStatus) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)))
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
            <CardDescription>Overview of recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => handleChangeOrderStatus(order.id, value)}
                        defaultValue={order.status}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Type Management</CardTitle>
            <CardDescription>Add, edit, or remove product types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New Product Type"
                value={newProductType}
                onChange={(e) => setNewProductType(e.target.value)}
              />
              <Button onClick={handleAddProductType}>Add Type</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productTypes.map((type) => (
                  <TableRow key={type}>
                    <TableCell>{type}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="mr-2"
                            onClick={() => setEditingProductType({ oldName: type, newName: type })}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white shadow-lg rounded-lg p-6">
                          <DialogHeader>
                            <DialogTitle className="text-black">Edit Product Type</DialogTitle>
                            <DialogDescription>Change the name of the product type here.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="newTypeName" className="text-right text-black">
                                New Name
                              </Label>
                              <Input
                                id="newTypeName"
                                value={editingProductType?.newName || ""}
                                onChange={(e) =>
                                  setEditingProductType((prev) => ({ ...prev, newName: e.target.value }))
                                }
                                className="col-span-3 text-black"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleEditProductType}>Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => handleRemoveProductType(type)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Add, edit, or remove products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 mb-4">
              <Input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              />
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mr-2" onClick={() => setEditingProduct(product)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white shadow-lg rounded-lg p-6">
                          <DialogHeader>
                            <DialogTitle className="text-black">Edit Product</DialogTitle>
                            <DialogDescription>Make changes to the product details here.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right text-black">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={editingProduct?.name || ""}
                                onChange={(e) => setEditingProduct((prev) => ({ ...prev, name: e.target.value }))}
                                className="col-span-3 text-black"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="price" className="text-right text-black">
                                Price
                              </Label>
                              <Input
                                id="price"
                                type="number"
                                value={editingProduct?.price || ""}
                                onChange={(e) =>
                                  setEditingProduct((prev) => ({
                                    ...prev,
                                    price: Number.parseFloat(e.target.value),
                                  }))
                                }
                                className="col-span-3 text-black"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="quantity" className="text-right text-black">
                                Quantity
                              </Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={editingProduct?.quantity || ""}
                                onChange={(e) =>
                                  setEditingProduct((prev) => ({
                                    ...prev,
                                    quantity: Number.parseInt(e.target.value),
                                  }))
                                }
                                className="col-span-3 text-black"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="type" className="text-right text-black">
                                Type
                              </Label>
                              <Select
                                onValueChange={(value) => setEditingProduct((prev) => ({ ...prev, type: value }))}
                                defaultValue={editingProduct?.type}
                              >
                                <SelectTrigger className="col-span-3 text-black">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {productTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleEditProduct}>Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => handleRemoveProduct(product.id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

