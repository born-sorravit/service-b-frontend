import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ICurrency } from "@/interfaces/currency.interface";
import { ECurrency } from "@/enums/currency.enum";
import { formatNumber } from "@/utils/formatNumber";
import { IProduct } from "@/interfaces/product.interface";
import { Button } from "../ui/button";
import { TransactionServices } from "@/app/api/transaction.api";
import { IResponse } from "@/interfaces/response.interface";
import { IWithdrawResponse } from "@/interfaces/transaction.interface";
import { CustomDialog } from "../common/CustomDialog";

interface DialogShoppingCartProps {
  walletId: string;
  username: string;
  balance: number;
  cart: Record<string, number>;
  cartItems: IProduct[];
  cartCount: number;
  currencies: ICurrency[];
  refetch: () => void;
  setIsRefetchProduct: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccessOrder?: () => void;
}

function DialogShoppingCart({
  walletId,
  username,
  balance,
  cart,
  cartItems,
  cartCount,
  currencies,
  refetch,
  setIsRefetchProduct,
  onSuccessOrder,
}: DialogShoppingCartProps) {
  const [currency, setCurrency] = useState<string>();
  const [open, setOpen] = React.useState(false);
  const [titleDialog, setTitleDialog] = React.useState("");
  const [descriptionDialog, setDescriptionDialog] = React.useState("");
  // คำนวณราคารวม
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, product) => {
      const quantity = cart[product.id] || 0;
      const price = parseFloat(product.price);
      return sum + quantity * price;
    }, 0);
  }, [cartItems, cart]);

  const rate = useMemo(() => {
    if (currency) {
      return currencies.find((item) => item.currency === currency)?.rateToUSD;
    }
    return currencies.find((item) => item.currency === ECurrency.USD)
      ?.rateToUSD;
  }, [currency, currencies]);

  const convertedUSD = (totalAmount * Number(rate)).toFixed(2);
  const handleSubmitOrder = async () => {
    try {
      // Check balance
      if (Number(convertedUSD) > balance) {
        setOpen(true);
        setTitleDialog("Submit Order Failed ❌");
        setDescriptionDialog(
          `Insufficient balance. Please add more funds to your wallet.`
        );
        return;
      }

      const productInCart = cartItems.map((item) => {
        return {
          id: item.id,
          quantity: cart[item.id],
          price: Number(item.price),
          currency: item.priceUnit,
        };
      });

      const toUser = cartItems.map((item) => {
        return {
          amount: Number(item.price) * cart[item.id],
          currency: item.priceUnit as ECurrency,
          username: item.createdByUsername as string,
        };
      });
      const response = (await TransactionServices.withdraw(walletId, {
        username,
        toUsers: toUser,
        products: productInCart,
      })) as IResponse<IWithdrawResponse>;

      setOpen(true);
      if (response.data) {
        refetch();
        setIsRefetchProduct(true);
        setTitleDialog("Submit Order Success ✅");
        setDescriptionDialog(
          `Submit Order successfully. amount : ${formatNumber(
            response.data.totalWithdrawnUSD.toString()
          )} USD, to ${cartItems
            .map((item) => item.createdByUsername)
            .join(", ")} `
        );
        onSuccessOrder?.();
        setCurrency("");
      } else {
        setTitleDialog("Submit Order Failed ❌");
        setDescriptionDialog(`Something went wrong. Please try again.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="absolute top-4 right-6 z-10 cursor-pointer">
            <div className="relative">
              <ShoppingCart className="w-7 h-7 text-gray-700" />
              {cartCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-3 text-xs px-1.5 py-0.5  bg-red-400 text-white"
                >
                  {cartCount}
                </Badge>
              )}
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cart Items</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((product) => {
                const quantity = cart[product.id];
                const price = parseFloat(product.price);
                const total = (price * quantity).toFixed(2);

                return (
                  <div
                    key={product.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {quantity} × {formatNumber(product.price)}{" "}
                        {product.priceUnit}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      {formatNumber(total)} {product.priceUnit}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Select Currency:</span>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((item) => (
                      <SelectItem key={item.id} value={item.currency}>
                        {item.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span>
                  {formatNumber(totalAmount.toFixed(2))}{" "}
                  {cartItems[0].priceUnit}
                </span>
              </div>

              {currency && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Approx. in {currency}:</span>
                  <span>
                    {formatNumber(convertedUSD)} {currency}
                  </span>
                </div>
              )}
              <Button
                className="w-full"
                onClick={handleSubmitOrder}
                disabled={!currency}
              >
                Submit Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CustomDialog
        open={open}
        setOpen={setOpen}
        title={titleDialog}
        description={descriptionDialog}
      />
    </>
  );
}

export default DialogShoppingCart;
