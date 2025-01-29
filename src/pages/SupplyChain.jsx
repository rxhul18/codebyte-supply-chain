import { useState } from "react";
import getContract from "../utils/contract";
import { Button } from "../components/ui/button";
import AddProduct from "../components/supply-chain/AddProduct";
import ProductLookup from "../components/supply-chain/ProductLookup";
import ProductDetails from "../components/supply-chain/ProductDetails";
import UpdateProduct from "../components/supply-chain/UpdateProduct";
import { Alert, AlertDescription } from "../components/ui/alert";

const SupplyChain = () => {
  const [contract, setContract] = useState(null);
  const [productID, setProductID] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

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

  const handleLookup = async () => {
    if (!contract || !productID) {
      setError("Please provide product ID");
      return;
    }
    setLoading(true);
    try {
      const pid = BigInt(productID);
      const product = await contract.products(pid);
      
      // Format the product data
      setProductDetails({
        id: product.id,
        name: product.name,
        manufacturer: product.manufacturer,
        currentOwner: product.currentOwner,
        manufactureDate: product.manufactureDate,
        manufacturingLocation: product.manufacturingLocation,
        status: product.status,
        giTagNumber: product.giTagNumber,
        updateCount: product.updateCount
      });
      
      setError(null);
    } catch (error) {
      console.error("Lookup error:", error);
      setError(error.message);
      setProductDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Supply Chain Dashboard
        </h1>
        
        <div className="text-center mb-6">
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            variant="outline"
            size="lg"
          >
            {isConnecting ? 'Connecting...' : contract ? 'Wallet Connected' : 'Connect Wallet'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <AddProduct 
            contract={contract}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
          
          <ProductLookup 
            productID={productID}
            setProductID={setProductID}
            onLookup={handleLookup}
            loading={loading}
          />
        </div>

        {productID && (
          <UpdateProduct 
            contract={contract}
            productID={productID}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {productDetails && (
          <ProductDetails product={productDetails} />
        )}
      </div>
    </div>
  );
};

export default SupplyChain; 