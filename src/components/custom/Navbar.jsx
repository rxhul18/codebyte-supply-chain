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
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/supply">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link to="/roles">
              <Button variant="ghost">Roles</Button>
            </Link>
            <Link to="/manufacturing">
              <Button variant="ghost">Manufacturing</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;