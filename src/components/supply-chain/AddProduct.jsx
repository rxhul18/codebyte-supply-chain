import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const AddProduct = ({ contract, setError, loading, setLoading }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");

  const handleAddProduct = async () => {
    if (!contract) {
      setError("Please connect wallet first");
      return;
    }
    if (!productName || !description || !manufacturer) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.addProduct(productName, description, manufacturer);
      await tx.wait();
      alert("Product added successfully!");
      // Clear form
      setProductName("");
      setDescription("");
      setManufacturer("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />
        <Button 
          onClick={handleAddProduct} 
          disabled={loading}
          className="w-full"
        >
          Add Product
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddProduct; 