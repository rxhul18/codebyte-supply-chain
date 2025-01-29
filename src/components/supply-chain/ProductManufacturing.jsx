import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import QRCode from "react-qr-code";

const ProductManufacturing = ({ contract, setError, loading, setLoading }) => {
  // State for manufacture product
  const [productName, setProductName] = useState("");
  const [location, setLocation] = useState("");
  const [giTagNumber, setGiTagNumber] = useState("");
  
  // State for ownership transfer
  const [productId, setProductId] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProductId, setNewProductId] = useState("");

  const handleManufactureProduct = async () => {
    if (!contract || !productName || !location || !giTagNumber) {
      setError("Please provide all product details");
      return;
    }
    setLoading(true);
    try {
      // Convert giTagNumber to BigInt
      const giTag = BigInt(giTagNumber);
      
      // Call manufactureProduct with the correct parameters
      const tx = await contract.manufactureProduct(
        productName,
        location,
        giTag
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the product ID from the event
      const event = receipt.events?.find(e => e.event === 'ProductManufactured');
      const productId = event?.args?.[0] || 'Unknown'; // First argument should be productId
      console.log({
        productId:productId,
        event:event,
      })
      // Set the new product ID and show modal
      setNewProductId(productId.toString());
      setShowModal(true);
      
      // Clear form
      setProductName("");
      setLocation("");
      setGiTagNumber("");
    } catch (error) {
      console.error("Manufacturing error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!contract || !productId || !newOwner) {
      setError("Please provide product ID and new owner address");
      return;
    }
    setLoading(true);
    try {
      const pid = BigInt(productId);
      const tx = await contract.transferOwnership(pid, newOwner);
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Product Manufacturing & Ownership</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manufacture">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manufacture">Manufacture</TabsTrigger>
              <TabsTrigger value="ownership">Ownership</TabsTrigger>
            </TabsList>

            <TabsContent value="manufacture" className="space-y-4">
              <div className="space-y-4">
                <Input
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <Input
                  placeholder="Manufacturing Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  placeholder="GI Tag Number"
                  type="number"
                  value={giTagNumber}
                  onChange={(e) => setGiTagNumber(e.target.value)}
                />
                <Button 
                  onClick={handleManufactureProduct} 
                  disabled={loading}
                  className="w-full"
                >
                  Manufacture Product
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ownership" className="space-y-4">
              <div className="space-y-4">
                <Input
                  placeholder="Product ID"
                  type="number"
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Manufactured Successfully!</DialogTitle>
            <DialogDescription>
              Your product has been manufactured. Please save this QR code for future reference.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {/* <div className="text-center">
              <p className="text-lg font-semibold mb-2">Product ID:</p>
              {/* <p className="text-2xl font-bold text-primary">{newProductId}</p> */}
            {/* </div> */} 
            {/* <div className="w-48 h-48">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={newProductId}
                viewBox={`0 0 256 256`}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to quickly look up your product details in the future.
            </p> */}
            {/* <div className="w-full flex justify-center">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "200px" }}
                value={newProductId}
                viewBox={`0 0 256 256`}
              />  
          </div> */}
            <Button 
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductManufacturing; 