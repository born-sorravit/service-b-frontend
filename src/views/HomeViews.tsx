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
import Products from "@/components/home/Products";

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

      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
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

      <DialogShoppingCart
        walletId={user.wallet?.id || ""}
        username={user.username || ""}
        balance={Number(user.wallet?.balance) || 0}
        cart={cart}
        cartItems={cartItems || []}
        cartCount={cartCount}
        currencies={currency}
        refetch={refetch}
        setIsRefetchProduct={setIsRefetchProduct}
        onSuccessOrder={() => {
          setCart({});
        }}
      />

      <Products products={products || []} cart={cart} setCart={setCart} />
    </div>
  );
}

export default HomeViews;
