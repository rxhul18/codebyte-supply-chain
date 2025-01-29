import QRCode from "react-qr-code";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const ProductDetails = ({ product }) => {
  if (!product) return null;
  
  // Convert status number to string
  const getStatusString = (status) => {
    const statusMap = {
      0: "Manufactured",
      1: "Shipped",
      2: "Delivered",
      3: "Sold"
    };
    return statusMap[status] || "Unknown";
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(Number(timestamp) * 1000).toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Convert BigInt to string for QR code
  const getQRValue = () => {
    if (!product.id) return "";
    return product.id.toString(); // Convert BigInt to string
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-left">
          <p className="font-semibold">ID:</p>
          <p>{product.id ? product.id.toString() : 'N/A'}</p>
          
          <p className="font-semibold">Name:</p>
          <p>{product.name || 'N/A'}</p>
          
          <p className="font-semibold">Manufacturer:</p>
          <p>{product.manufacturer || 'N/A'}</p>
          
          <p className="font-semibold">Current Owner:</p>
          <p>{product.currentOwner || 'N/A'}</p>
          
          <p className="font-semibold">Manufacturing Location:</p>
          <p>{product.manufacturingLocation || 'N/A'}</p>
          
          <p className="font-semibold">Status:</p>
          <p>{getStatusString(Number(product.status))}</p>
          
          <p className="font-semibold">GI Tag Number:</p>
          <p>{product.giTagNumber ? product.giTagNumber.toString() : 'N/A'}</p>
          
          <p className="font-semibold">Manufacture Date:</p>
          <p>{formatTimestamp(product.manufactureDate)}</p>
          
          <p className="font-semibold">Update Count:</p>
          <p>{product.updateCount ? product.updateCount.toString() : '0'}</p>
        </div>

          <h2 className="py-3 text-xl font-semibold">Product Id QR Code</h2>
          <div className="w-full flex justify-center">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "200px" }}
              value={getQRValue()}
              viewBox={`0 0 256 256`}
            />  
          </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails; 