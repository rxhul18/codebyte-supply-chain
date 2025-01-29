import { useState } from "react";
import getContract from "../utils/contract";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SupplyChain = () => {
  const [contract, setContract] = useState(null);
  const [productID, setProductID] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  
  // Form states
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const contractInstance = await getContract();
      setContract(contractInstance);
    } catch (err) {
      setError(err.message);
      console.error("Connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const addProduct = async () => {
    if (!contract) {
      setError("Please connect wallet first");
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

  const updateLocation = async () => {
    if (!contract || !productID || !location) {
      setError("Please provide product ID and location");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.updateLocation(productID, location);
      await tx.wait();
      alert("Location updated successfully!");
      setLocation("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!contract || !productID || !status) {
      setError("Please provide product ID and status");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.updateStatus(productID, status);
      await tx.wait();
      alert("Status updated successfully!");
      setStatus("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    if (!contract || !productID) {
      setError("Please provide product ID");
      return;
    }
    setLoading(true);
    try {
      const product = await contract.getProduct(productID);
      setProductDetails({
        name: product[0],
        description: product[1],
        manufacturer: product[2],
        location: product[3],
        status: product[4],
        timestamp: new Date(Number(product[5]) * 1000).toLocaleString()
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      setProductDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supply Chain Dashboard</h1>
      
      <div className="mb-4">
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="border-gray-300"
        >
          {isConnecting ? 'Connecting...' : contract ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Add Product Form */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
          <div className="space-y-2">
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
              onClick={addProduct} 
              disabled={loading}
              className="w-full"
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Product Lookup */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Product Lookup</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Product ID"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
            />
            <Button onClick={fetchProduct} disabled={loading}>
              Lookup
            </Button>
          </div>
        </div>

        {/* Update Product */}
        {productID && (
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Update Product</h2>
            <div className="space-y-2">
              <Input
                placeholder="New Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button 
                onClick={updateLocation} 
                disabled={loading}
                className="w-full"
              >
                Update Location
              </Button>
              
              <Input
                placeholder="New Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
              <Button 
                onClick={updateStatus} 
                disabled={loading}
                className="w-full"
              >
                Update Status
              </Button>
            </div>
          </div>
        )}

        {/* Product Details */}
        {productDetails && (
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <div className="space-y-1">
              <p><strong>Name:</strong> {productDetails.name}</p>
              <p><strong>Description:</strong> {productDetails.description}</p>
              <p><strong>Manufacturer:</strong> {productDetails.manufacturer}</p>
              <p><strong>Location:</strong> {productDetails.location}</p>
              <p><strong>Status:</strong> {productDetails.status}</p>
              <p><strong>Timestamp:</strong> {productDetails.timestamp}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChain;