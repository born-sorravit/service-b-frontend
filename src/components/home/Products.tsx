import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { IProduct } from "@/interfaces/product.interface";
import { formatNumber } from "@/utils/formatNumber";
interface ProductsProps {
  products: IProduct[] | undefined;
  cart: Record<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}
function Products({ products, cart, setCart }: ProductsProps) {
  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative w-full flex justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width="0"
                  height="0"
                  sizes="200vw"
                  className="w-[300px] h-auto"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                {cart[product.id] && (
                  <Badge className="ml-2" variant="secondary">
                    In cart: {cart[product.id]}
                  </Badge>
                )}
              </div>

              <CardDescription className="text-sm">
                Created by:{" "}
                <span className="font-medium">{product.createdByUsername}</span>
              </CardDescription>

              <div className="text-sm">
                Price:{" "}
                <span className="font-semibold">
                  {formatNumber(product.price)} {product.priceUnit}
                </span>
              </div>

              <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                Quantity: {formatNumber(product.quantity.toString())}
              </Badge>

              <Button
                className="w-full mt-2"
                onClick={() => handleAddToCart(product.id)}
                disabled={cart[product.id] >= product.quantity}
              >
                + Add to cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Products;
