import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const RoleManagement = ({ contract, setError, loading, setLoading }) => {
  const [address, setAddress] = useState("");

  const handleAddRole = async (role) => {
    if (!contract || !address) {
      setError("Please provide an address");
      return;
    }
    setLoading(true);
    try {
      let tx;
      switch (role) {
        case 'manufacturer':
          tx = await contract.addManufacturer(address);
          break;
        case 'retailer':
          tx = await contract.addRetailer(address);
          break;
        case 'shipper':
          tx = await contract.addShipper(address);
          break;
        default:
          throw new Error("Invalid role");
      }
      await tx.wait();
      alert(`${role} added successfully!`);
      setAddress("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manufacturer">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manufacturer">Manufacturer</TabsTrigger>
            <TabsTrigger value="retailer">Retailer</TabsTrigger>
            <TabsTrigger value="shipper">Shipper</TabsTrigger>
          </TabsList>

          <TabsContent value="manufacturer" className="space-y-4">
            <Input
              placeholder="Manufacturer Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button 
              onClick={() => handleAddRole('manufacturer')} 
              disabled={loading}
              className="w-full"
            >
              Add Manufacturer
            </Button>
          </TabsContent>

          <TabsContent value="retailer" className="space-y-4">
            <Input
              placeholder="Retailer Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button 
              onClick={() => handleAddRole('retailer')} 
              disabled={loading}
              className="w-full"
            >
              Add Retailer
            </Button>
          </TabsContent>

          <TabsContent value="shipper" className="space-y-4">
            <Input
              placeholder="Shipper Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button 
              onClick={() => handleAddRole('shipper')} 
              disabled={loading}
              className="w-full"
            >
              Add Shipper
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoleManagement; 