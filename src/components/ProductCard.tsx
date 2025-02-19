
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({ ...product, quantity: 1 });
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
            <span className="text-xs text-muted-foreground">متوفر</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className={cn(
            "w-full transition-all duration-300",
            isAdding && "bg-green-500 hover:bg-green-600"
          )}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <span 
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              isAdding ? "scale-110" : ""
            )}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" />
                تمت الإضافة
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                أضف إلى العربة
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
