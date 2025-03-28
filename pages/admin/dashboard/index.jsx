"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function AdminDashboard() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    type: "",
    image: "",
    sizes: "",
  });
  const [editingProduct, setEditingProduct] = useState(
    {
      name: "",
      price: "",
      quantity: "",
      type: "",
      sizes: "",
    }
  );
  const [newProductType, setNewProductType] = useState("");
  const [editingProductType, setEditingProductType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch("/api/order");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        if (err instanceof Error) {
          // Accessing the message property safely if it's an instance of Error
          setError(`Error: ${err.message}`);
        } else {
          // Fallback for any other type of error
          setError("An unknown error occurred");
        }
      }
    };
    const getProducts = async () => {
      try {
        const response = await fetch("/api/product-management");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products); // ✅ Set the fetched data
      } catch (err) {
        if (err instanceof Error) {
          // Accessing the message property safely if it's an instance of Error
          setError(`Error: ${err.message}`);
        } else {
          // Fallback for any other type of error
          setError("An unknown error occurred");
        }
      }
    };
    const fetchProductTypes = async () => {
      try {
        const response = await fetch("/api/product-type"); // ✅ Fetch from backend
        if (!response.ok) {
          throw new Error("Failed to fetch product types");
        }
        const data = await response.json();
        setProductTypes(data.data); // ✅ Set the fetched data
      } catch (err) {
        if (err instanceof Error) {
          // Accessing the message property safely if it's an instance of Error
          setError(`Error: ${err.message}`);
        } else {
          // Fallback for any other type of error
          setError("An unknown error occurred");
        }
      }
    };
    const fetchContactSubmissions = async () => {
      try {
        const response = await fetch("/api/contact-details"); // ✅ Fetch from backend
        if (!response.ok) {
          throw new Error("Failed to fetch contact submissions");
        }
        const data = await response.json();
        setContactSubmissions(data.data); // ✅ Set the fetched data
      } catch (err) {
        if (err instanceof Error) {
          // Accessing the message property safely if it's an instance of Error
          setError(`Error: ${err.message}`);
        } else {
          // Fallback for any other type of error
          setError("An unknown error occurred");
        }
      } finally {
      }
    };
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (!isLoggedIn) {
          router.push("/admin/login");
        }
      } catch (err) {
        if (err instanceof Error) {
          // Accessing the message property safely if it's an instance of Error
          setError(`Error: ${err.message}`);
        } else {
          // Fallback for any other type of error
          setError("An unknown error occurred");
        }
      } finally {
        getOrders();
        fetchContactSubmissions();
        fetchProductTypes();
        getProducts();
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const handleAddProduct = async () => {
    if (
      newProduct.name &&
      newProduct.price &&
      newProduct.quantity &&
      newProduct.type &&
      newProduct.image &&
      newProduct.sizes
    ) {
      try {
        // 🔹 Ensure sizes are stored as an array
        const parsedSizes = typeof newProduct.sizes === "string"
          ? newProduct.sizes.split(",").map((s) => s.trim()).filter((s) => s) // Convert string to array
          : newProduct.sizes; // If already an array, use as is

        const response = await fetch("/api/product-management", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newProduct,
            sizes: parsedSizes, // 🔹 Ensuring sizes are correctly formatted
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add product");
        }

        const data = await response.json();

        // 🔹 If successful, update the product list
        setProducts((prevProducts) => [...prevProducts, data.product]);

        // 🔹 Reset the new product fields
        setNewProduct({
          name: "",
          price: "",
          quantity: "",
          type: "",
          image: "",
          sizes: "", // Reset sizes as an empty string
        });

        setSizesInput(""); // Also reset the input field

      } catch (err) {
        if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          setError("An unknown error occurred");
        }
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct) {
      try {
        const response = await fetch(`/api/product-management`, {
          method: "PUT", // or "PATCH", depending on your API design
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingProduct),
        });

        const data = await response.json();

        if (data.success) {
          // After successful edit, update the product list in state
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === editingProduct._id ? data.product : product
            )
          );
          setEditingProduct(
            {
              name: "",
              price: "",
              quantity: "",
              type: "",
              sizes: "",
            }
          ); // Reset the editing state
        } else {
          alert(data.message); // Show an error message if edit failed
        }
      } catch (error) {
        console.error("Error editing product:", error);
        alert("Failed to edit product");
      }
    }
  };

  const handleRemoveProduct = async (id) => {
    try {
      const response = await fetch("/api/product-management", {
        method: "DELETE", // Use DELETE method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Send product ID in the request body
      });

      const data = await response.json();

      if (data.success) {
        // If the delete was successful, update the local state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
      } else {
        // Handle the case where deletion was unsuccessful
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleAddProductType = async () => {
    if (
      newProductType &&
      !productTypes.some((type) => type.name === newProductType)
    ) {
      const response = await fetch("/api/product-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProductType }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      // Assuming 'data.data' contains the new product type object from the backend.
      setProductTypes([...productTypes, data.data]);
      setNewProductType(""); // Clear the input field
    }
  };

  const handleEditProductType = async () => {
    if (editingProductType?.newName && editingProductType?.id) {
      const response = await fetch("/api/product-type", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProductType.id,
          newName: editingProductType.newName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      setProductTypes(
        productTypes.map((type) =>
          type._id === data.data._id ? data.data : type
        )
      );
      setEditingProductType(null); // Close the edit dialog
    }
  };

  const handleRemoveProductType = async (id) => {
    try {
      const response = await fetch("/api/product-type", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Send the ID to delete
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      // Remove from state after successful deletion
      setProductTypes((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      setError("Failed to delete product type");
    }
  };

  const handleChangeOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch("/api/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Error updating order status:", data.message);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.value });
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
          Admin Dashboard
        </h1>
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
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>{order.fullName}</TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>{order.phoneNumber}</TableCell>
                        <TableCell>{order.shippingAddress}</TableCell>
                        <TableCell className="text-right">
                          PKR {order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Select
                              onValueChange={(value) =>
                                handleChangeOrderStatus(order._id, value)
                              }
                              defaultValue={order.status}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Processing">
                                  Processing
                                </SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="Cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View
                            </Button>
                          </div>
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
                  required={true}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  required={true}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  required={true}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: Number(e.target.value),
                    })
                  }
                />
                <Select
                  value={newProduct.type || ""} // Default value (empty string means no type selected)
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, type: value })
                  } // Update type ID
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Enter image URL"
                  onChange={handleImageChange}
                  className="border p-2 rounded-md w-full"
                  required={true}
                  value={newProduct.image}
                />

                {/* New Sizes Input Field */}
                <Input
                  id="sizes"
                  value={newProduct.sizes}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // setSizesInput(newValue);
                    setNewProduct((prev) => ({
                      ...prev,
                      sizes: newValue, // Store the raw string value
                    }));
                  }}
                  placeholder="Enter sizes separated by commas"
                  className="col-span-3 text-black"
                />

                <Button onClick={handleAddProduct} className="w-full">
                  Add Product
                </Button>
              </div>

              <ScrollArea className="h-[300px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Sizes</TableHead> {/* New column for sizes */}
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            {product.image ? (
                              <div
                                style={{
                                  position: "relative",
                                  width: 48,
                                  height: 48,
                                }}
                              >
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              </div>
                            ) : (
                              <span className="text-gray-500">No Image</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>PKR{product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {product.sizes && product.sizes.length > 0
                              ? product.sizes.join(", ")
                              : "N/A"}
                          </TableCell>
                          <TableCell>{product.type?.name || "Unknown"}</TableCell>
                          <TableCell className="text-right">
                            {/* Edit Dialog Trigger */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() =>
                                    setEditingProduct({
                                      ...product,
                                      type: product.type?._id, // Populate the type field with its ID
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              {/* Edit Dialog Content */}
                              <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-black">
                                    Edit Product
                                  </DialogTitle>
                                  <DialogDescription>
                                    Make changes to the product details here.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-black">
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      value={editingProduct?.name || ""}
                                      onChange={(e) =>
                                        setEditingProduct((prev) => ({
                                          ...prev,
                                          name: e.target.value,
                                        }))
                                      }
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
                                    <Label
                                      htmlFor="quantity"
                                      className="text-right text-black"
                                    >
                                      Quantity
                                    </Label>
                                    <Input
                                      id="quantity"
                                      type="number"
                                      value={editingProduct?.quantity ?? ""}
                                      onChange={(e) =>
                                        setEditingProduct((prev) => ({
                                          ...prev,
                                          quantity: Number.parseInt(e.target.value),
                                        }))
                                      }
                                      className="col-span-3 text-black"
                                    />
                                  </div>
                                  {/* New Sizes Input Field */}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="sizes" className="text-right text-black">
                                      Sizes
                                    </Label>
                                    <Input
                                      id="sizes"
                                      value={editingProduct.sizes}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        setEditingProduct((prev) => ({
                                          ...prev,
                                          sizes: newValue, // Store the raw string value
                                        }));
                                      }}
                                      placeholder="Enter sizes separated by commas"
                                      className="col-span-3 text-black"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right text-black">
                                      Type
                                    </Label>
                                    <Select
                                      onValueChange={(value) =>
                                        setEditingProduct((prev) => ({
                                          ...prev,
                                          type: value,
                                        }))
                                      }
                                      defaultValue={editingProduct?.type}
                                    >
                                      <SelectTrigger className="col-span-3 text-black">
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {productTypes.map((type) => (
                                          <SelectItem key={type._id} value={type._id}>
                                            {type.name}
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
                            {/* Remove Product Button */}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveProduct(product._id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500">
                          No products available.
                        </TableCell>
                      </TableRow>
                    )}
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
              <CardDescription>
                Add, edit, or remove product types
              </CardDescription>
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
                    {productTypes && productTypes.length > 0 ? (
                      productTypes.map((type) => (
                        <TableRow key={type._id}>
                          <TableCell className="font-medium">
                            {type.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() =>
                                    setEditingProductType({
                                      id: type._id,
                                      newName: type.name,
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-black">
                                    Edit Product Type
                                  </DialogTitle>
                                  <DialogDescription>
                                    Change the name of the product type here.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="newTypeName"
                                      className="text-right text-black"
                                    >
                                      New Name
                                    </Label>
                                    <Input
                                      id="newTypeName"
                                      value={editingProductType?.newName || ""}
                                      onChange={(e) =>
                                        setEditingProductType((prev) => ({
                                          ...prev,
                                          newName: e.target.value,
                                        }))
                                      }
                                      className="col-span-3 text-black"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleEditProductType}>
                                    Save changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveProductType(type._id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-gray-500"
                        >
                          No product types available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>
                Messages submitted via the contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contactSubmissions && contactSubmissions.length > 0 ? (
                <ScrollArea className="h-[400px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.map((submission, index) => (
                        <TableRow key={index}>
                          <TableCell>{submission.name}</TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>{submission.phone}</TableCell>
                          <TableCell>{submission.message}</TableCell>
                          <TableCell>
                            {new Date(submission.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p>No contact submissions found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">Order Details</DialogTitle>
              <DialogDescription className="text-black">
                Order ID: {selectedOrder._id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right text-black">
                  Customer
                </Label>
                <Input
                  id="customer"
                  value={selectedOrder.fullName}
                  className="col-span-3 text-black"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  value={selectedOrder.email}
                  className="col-span-3 text-black"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-black">
                  Address
                </Label>
                <Input
                  id="address"
                  value={selectedOrder.shippingAddress}
                  className="col-span-3 text-black"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right text-black">
                  Status
                </Label>
                <Input
                  id="status"
                  value={selectedOrder.status}
                  className="col-span-3 text-black"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-black">Items</Label>
                <div className="col-span-3">
                  {selectedOrder.cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-black">
                      <span>
                        {item.name} x {item.quantity}{" "}
                        {item.size ? `(Size: ${item.size})` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right text-black">
                  Total
                </Label>
                <Input
                  id="total"
                  value={`PKR ${selectedOrder.totalAmount.toFixed(2)}`}
                  className="col-span-3 text-black"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment" className="text-right text-black">
                  Payment Method
                </Label>
                <Input
                  id="payment"
                  value={selectedOrder.paymentMethod}
                  className="col-span-3 text-black"
                  readOnly
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
