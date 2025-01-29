import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ShipmentManagement = ({ contract, setError, loading, setLoading }) => {
  const [productId, setProductId] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [updateId, setUpdateId] = useState("");

  const handleUpdateStatus = async () => {
    if (!contract || !productId || !location || !status) {
      setError("Please provide all required details");
      return;
    }
    setLoading(true);
    try {
      // Convert to BigInt
      const pid = BigInt(productId);
      const statusNum = BigInt(status);
      const tx = await contract.updateProductStatus(pid, statusNum, location, notes || "");
      await tx.wait();
      alert("Product status updated successfully!");
      // Clear form
      setLocation("");
      setNotes("");
      setStatus("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetShipmentUpdate = async () => {
    if (!contract || !productId || !updateId) {
      setError("Please provide product ID and update ID");
      return;
    }
    setLoading(true);
    try {
      // Convert to BigInt
      const pid = BigInt(productId);
      const uid = BigInt(updateId);
      const update = await contract.getShipmentUpdate(pid, uid);
      alert(`
        Shipment Update:
        Updated By: ${update.updatedBy}
        Time: ${new Date(Number(update.timestamp) * 1000).toLocaleString()}
        Location: ${update.location}
        Notes: ${update.notes}
        Status: ${Number(update.newStatus)}
      `);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Product ID"
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Manufactured</SelectItem>
              <SelectItem value="1">Shipped</SelectItem>
              <SelectItem value="2">Delivered</SelectItem>
              <SelectItem value="3">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button 
          onClick={handleUpdateStatus} 
          disabled={loading}
          className="w-full"
        >
          Update Status
        </Button>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Get Shipment Update</h3>
          <div className="space-y-4">
            <Input
              placeholder="Update ID"
              type="number"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
            />
            <Button 
              onClick={handleGetShipmentUpdate} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Get Update Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentManagement; 