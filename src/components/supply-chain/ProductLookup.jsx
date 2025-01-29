import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const ProductLookup = ({ 
  productID, 
  setProductID, 
  onLookup, 
  loading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Lookup</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ProductLookup; 