import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ProductManufacturing = ({ contract, setError, loading, setLoading }) => {
  const [productId, setProductId] = useState("");
  const [giTagDetails, setGiTagDetails] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleManufactureProduct = async () => {
    if (!contract || !productId) {
      setError("Please provide a product ID");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.manufactureProduct(productId);
      await tx.wait();
      alert("Product manufactured successfully!");
      setProductId("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGITagRegistration = async () => {
    if (!contract || !productId || !giTagDetails) {
      setError("Please provide all details");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.GITagRegistered(productId, giTagDetails);
      await tx.wait();
      alert("GI Tag registered successfully!");
      setProductId("");
      setGiTagDetails("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!contract || !productId || !newOwner) {
      setError("Please provide all details");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.transferOwnership(productId, newOwner);
      await tx.wait();
      alert("Ownership transferred successfully!");
      setProductId("");
      setNewOwner("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Manufacturing & Ownership</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manufacture">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manufacture">Manufacture</TabsTrigger>
            <TabsTrigger value="gitag">GI Tag</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
          </TabsList>

          <TabsContent value="manufacture" className="space-y-4">
            <Input
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <Button 
              onClick={handleManufactureProduct} 
              disabled={loading}
              className="w-full"
            >
              Manufacture Product
            </Button>
          </TabsContent>

          <TabsContent value="gitag" className="space-y-4">
            <Input
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <Input
              placeholder="GI Tag Details"
              value={giTagDetails}
              onChange={(e) => setGiTagDetails(e.target.value)}
            />
            <Button 
              onClick={handleGITagRegistration} 
              disabled={loading}
              className="w-full"
            >
              Register GI Tag
            </Button>
          </TabsContent>

          <TabsContent value="ownership" className="space-y-4">
            <Input
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <Input
              placeholder="New Owner Address"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            />
            <Button 
              onClick={handleTransferOwnership} 
              disabled={loading}
              className="w-full"
            >
              Transfer Ownership
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductManufacturing; 