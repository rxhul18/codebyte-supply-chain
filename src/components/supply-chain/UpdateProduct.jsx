import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const UpdateProduct = ({ 
  contract, 
  productID, 
  setError, 
  loading, 
  setLoading 
}) => {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const handleUpdateLocation = async () => {
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

  const handleUpdateStatus = async () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="New Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button 
            onClick={handleUpdateLocation} 
            disabled={loading}
            className="w-full"
          >
            Update Location
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="New Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Button 
            onClick={handleUpdateStatus} 
            disabled={loading}
            className="w-full"
          >
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdateProduct; 