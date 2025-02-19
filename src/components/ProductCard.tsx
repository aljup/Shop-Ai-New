
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useCart } from "@/store/cart";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

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
          className="w-full"
          onClick={() => addItem({ ...product, quantity: 1 })}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
