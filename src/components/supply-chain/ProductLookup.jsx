import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Scanner } from '@yudiel/react-qr-scanner';

const ProductLookup = ({ 
  productID, 
  setProductID, 
  onLookup, 
  loading 
}) => {
  const handleScan = (result) => {

    if (result[0]?.rawValue) {
      // Update the productID state with the scanned value
      setProductID(result[0].rawValue);
      // Trigger the lookup function
      onLookup();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Lookup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Product ID"
            value={productID}
            onChange={(e) => setProductID(e.target.value)}
          />
          <Button onClick={onLookup} disabled={loading}>
            Lookup
          </Button>
        </div>
        <div className="mt-4">
          <Scanner 
            onScan={handleScan}
            onError={(error) => console.error(error)}
            style={{ width: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductLookup; 