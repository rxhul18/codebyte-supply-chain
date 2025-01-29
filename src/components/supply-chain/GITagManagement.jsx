import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const GITagManagement = ({ contract, setError, loading, setLoading }) => {
  const [giTagNumber, setGiTagNumber] = useState("");
  const [region, setRegion] = useState("");
  const [traditionalMethod, setTraditionalMethod] = useState("");

  const handleRegisterGITag = async () => {
    if (!contract || !giTagNumber || !region || !traditionalMethod) {
      setError("Please provide all GI Tag details");
      return;
    }
    setLoading(true);
    try {
      // Convert to BigInt
      const tagNumber = BigInt(giTagNumber);
      const tx = await contract.registerGITag(tagNumber, region, traditionalMethod);
      await tx.wait();
      alert("GI Tag registered successfully!");
      // Clear form
      setGiTagNumber("");
      setRegion("");
      setTraditionalMethod("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetGITagInfo = async () => {
    if (!contract || !giTagNumber) {
      setError("Please provide GI Tag number");
      return;
    }
    setLoading(true);
    try {
      // Convert to BigInt
      const tagNumber = BigInt(giTagNumber);
      const info = await contract.getManufacturingInfoByGITag(tagNumber);
      alert(`
        GI Tag Info:
        Region: ${info.giInfo.region}
        Traditional Method: ${info.giInfo.traditionalMethod}
        Registration Date: ${new Date(Number(info.giInfo.registrationDate) * 1000).toLocaleString()}
        Valid: ${info.giInfo.isValid ? 'Yes' : 'No'}
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
        <CardTitle>GI Tag Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="register">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="lookup">Lookup</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4">
            <Input
              placeholder="GI Tag Number"
              type="number"
              value={giTagNumber}
              onChange={(e) => setGiTagNumber(e.target.value)}
            />
            <Input
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <Input
              placeholder="Traditional Method"
              value={traditionalMethod}
              onChange={(e) => setTraditionalMethod(e.target.value)}
            />
            <Button 
              onClick={handleRegisterGITag} 
              disabled={loading}
              className="w-full"
            >
              Register GI Tag
            </Button>
          </TabsContent>

          <TabsContent value="lookup" className="space-y-4">
            <Input
              placeholder="GI Tag Number"
              type="number"
              value={giTagNumber}
              onChange={(e) => setGiTagNumber(e.target.value)}
            />
            <Button 
              onClick={handleGetGITagInfo} 
              disabled={loading}
              className="w-full"
            >
              Lookup GI Tag
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GITagManagement; 