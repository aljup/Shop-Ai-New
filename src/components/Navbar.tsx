
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/store/cart";

export const Navbar = () => {
  const cart = useCart();
  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full fixed top-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Store
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="relative" onClick={() => {}}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};
