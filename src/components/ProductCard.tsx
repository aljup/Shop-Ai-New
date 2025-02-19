
import { useState } from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useCart } from "@/store/cart";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({ ...product, quantity: 1 });
    
    // إعادة تعيين حالة الزر بعد 1.5 ثانية
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          <p className="text-lg font-semibold mt-2">${product.price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          className={cn(
            "w-full transition-all duration-300",
            isAdding && "bg-green-500 hover:bg-green-600"
          )}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <span className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isAdding ? "scale-110" : ""
          )}>
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
