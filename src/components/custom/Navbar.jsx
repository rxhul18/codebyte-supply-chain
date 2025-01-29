import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Supply Chain
          </Link>
          
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="default">Home</Button>
            </Link>
            <Link to="/supply">
              <Button variant="default">Products</Button>
            </Link>
            <Link to="/roles">
              <Button variant="default">Roles</Button>
            </Link>
            <Link to="/manufacturing">
              <Button variant="default">Manufacturing</Button>
            </Link>
            <Link to="/gitag">
              <Button variant="default">GI Tag</Button>
            </Link>
            <Link to="/shipment">
              <Button variant="default">Shipment</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;