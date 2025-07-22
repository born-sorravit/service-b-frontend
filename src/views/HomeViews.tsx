"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUserStore } from "@/stores/user/user.modal";
import UserInfo from "@/components/home/UserInfo";
import DialogShoppingCart from "@/components/home/DialogShoppingCart";
import { useCurrencyStore } from "@/stores/currency/currency.modal";
import { CurrencyServices } from "@/app/api/currency.api";
import { IResponse } from "@/interfaces/response.interface";
import { ICurrency } from "@/interfaces/currency.interface";
import { IProduct } from "@/interfaces/product.interface";
import { ProductServices } from "@/app/api/product.api";

function HomeViews() {
  const { user, refetch, reset } = useUserStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<IProduct[]>();
  const [isRefetchProduct, setIsRefetchProduct] = useState(false);
  const fetchCurrency = async () => {
    try {
      const response = (await CurrencyServices.getCurrency()) as IResponse<
        ICurrency[]
      >;

      console.log(response);

      if (response.data) {
        setCurrency(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = (await ProductServices.getProducts()) as IResponse<
        IProduct[]
      >;

      console.log(response);

      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const cartItems =
    products?.length && products.filter((product) => cart[product.id]);

  useEffect(() => {
    fetchCurrency();
    fetchProduct();
  }, []);

  useEffect(() => {
    if (isRefetchProduct) {
      fetchProduct();
      setIsRefetchProduct(false);
    }
  }, [isRefetchProduct]);

  return (
    <div className="p-6 relative min-h-screen space-y-3">
      <UserInfo user={user} />

      {/* 🛒 ตะกร้าสินค้า */}
      <DialogShoppingCart
        walletId={user.wallet?.id || ""}
        cart={cart}
        cartItems={cartItems || []}
        cartCount={cartCount}
        currencies={currency}
        refetch={refetch}
        setIsRefetchProduct={setIsRefetchProduct}
      />

      {/* รายการสินค้า */}
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
                  {product.price} {product.priceUnit}
                </span>
              </div>

              <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                Quantity: {product.quantity}
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
    </div>
  );
}

export default HomeViews;
