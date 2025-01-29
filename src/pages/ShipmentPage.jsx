import { useState } from "react";
import getContract from "../utils/contract";
import { Button } from "../components/ui/button";
import ShipmentManagement from "../components/supply-chain/ShipmentManagement";
import { Alert, AlertDescription } from "../components/ui/alert";

const ShipmentPage = () => {
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const contractInstance = await getContract();
      setContract(contractInstance);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Shipment Management
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

        <ShipmentManagement 
          contract={contract}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default ShipmentPage; 