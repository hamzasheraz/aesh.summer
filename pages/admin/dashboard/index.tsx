"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/contexts/AuthContext"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Updated mock data for orders
const mockOrders = [
  {
    id: 1,
    customer: "John Doe",
    email: "john@example.com",
    address: "123 Main St, City, Country",
    total: 99.99,
    status: "Completed",
  },
  {
    id: 2,
    customer: "Jane Smith",
    email: "jane@example.com",
    address: "456 Elm St, Town, Country",
    total: 149.99,
    status: "Processing",
  },
  {
    id: 3,
    customer: "Bob Johnson",
    email: "bob@example.com",
    address: "789 Oak St, Village, Country",
    total: 79.99,
    status: "Shipped",
  },
]

const mockProducts = [
  { id: 1, name: "Summer Dress", price: 49.99, quantity: 50, type: "Dresses" },
  { id: 2, name: "Beach Hat", price: 24.99, quantity: 100, type: "Accessories" },
  { id: 3, name: "Sunglasses", price: 39.99, quantity: 75, type: "Accessories" },
]

const mockProductTypes = ["Dresses", "Tops", "Bottoms", "Swimwear", "Accessories"]

const mockContactSubmissions = [
  { id: 1, name: "Alice Cooper", email: "alice@example.com", phone: "123-456-7890", message: "I love your products!" },
  {
    id: 2,
    name: "Bob Dylan",
    email: "bob@example.com",
    phone: "098-765-4321",
    message: "When will you restock beach towels?",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "555-555-5555",
    message: "Do you offer international shipping?",
  },
]

export default function AdminDashboard() {
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [products, setProducts] = useState(mockProducts)
  const [productTypes, setProductTypes] = useState(mockProductTypes)
  const [contactSubmissions, setContactSubmissions] = useState(mockContactSubmissions)
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

  const handleCancelOrder = (id) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "Cancelled" } : order)))
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="product-types">Product Types</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
              <CardDescription>Overview of recent orders</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>{order.address}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">
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
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="ml-2"
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Add, edit, or remove products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4">
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
                <Button onClick={handleAddProduct} className="w-full">
                  Add Product
                </Button>
              </div>
              <ScrollArea className="h-[300px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.type}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mr-2">
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                                <DialogDescription>Make changes to the product details here.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id="name"
                                    value={editingProduct?.name || ""}
                                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, name: e.target.value }))}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="price" className="text-right">
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
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="quantity" className="text-right">
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
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="type" className="text-right">
                                    Type
                                  </Label>
                                  <Select
                                    onValueChange={(value) => setEditingProduct((prev) => ({ ...prev, type: value }))}
                                    defaultValue={editingProduct?.type}
                                  >
                                    <SelectTrigger className="col-span-3">
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
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(product.id)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-types">
          <Card>
            <CardHeader>
              <CardTitle>Product Type Management</CardTitle>
              <CardDescription>Add, edit, or remove product types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input
                  placeholder="New Product Type"
                  value={newProductType}
                  onChange={(e) => setNewProductType(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleAddProductType}>Add Type</Button>
              </div>
              <ScrollArea className="h-[300px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productTypes.map((type) => (
                      <TableRow key={type}>
                        <TableCell className="font-medium">{type}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mr-2">
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Product Type</DialogTitle>
                                <DialogDescription>Change the name of the product type here.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="newTypeName" className="text-right">
                                    New Name
                                  </Label>
                                  <Input
                                    id="newTypeName"
                                    value={editingProductType?.newName || ""}
                                    onChange={(e) =>
                                      setEditingProductType((prev) => ({ ...prev, newName: e.target.value }))
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleEditProductType}>Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveProductType(type)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>View messages from the contact form</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone}</TableCell>
                        <TableCell>{submission.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

