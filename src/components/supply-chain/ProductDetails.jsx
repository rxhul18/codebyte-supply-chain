import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const ProductDetails = ({ product }) => {
  if (!product) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-left">
          <p className="font-semibold">Name:</p>
          <p>{product.name}</p>
          
          <p className="font-semibold">Description:</p>
          <p>{product.description}</p>
          
          <p className="font-semibold">Manufacturer:</p>
          <p>{product.manufacturer}</p>
          
          <p className="font-semibold">Location:</p>
          <p>{product.location}</p>
          
          <p className="font-semibold">Status:</p>
          <p>{product.status}</p>
          
          <p className="font-semibold">Timestamp:</p>
          <p>{product.timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails; 