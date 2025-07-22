"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/user/user.modal";
import UserInfo from "@/components/home/UserInfo";
import { IHistory } from "@/interfaces/history.interface";
import { HistoryServices } from "@/app/api/history.api";
import { IResponse } from "@/interfaces/response.interface";
import { formatNumber } from "@/utils/formatNumber";

function HistoryViews() {
  const { user } = useUserStore();

  const [history, setHistory] = React.useState<IHistory[]>();

  const fetchHistory = async () => {
    try {
      const response = (await HistoryServices.getHistory(
        user.username
      )) as IResponse<IHistory[]>;

      if (response.data) {
        setHistory(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);
  return (
    <div className="p-4 space-y-3">
      <UserInfo user={user} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {history?.length &&
          history.map((item) => (
            <Card key={item.productId} className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{item.productName}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <div className="w-24 h-24 relative">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col justify-between text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-primary">Quantity:</span>{" "}
                    {item.quantity}
                  </p>
                  <p>
                    <span className="font-medium text-primary">
                      Total price:
                    </span>{" "}
                    {formatNumber(item.price)}
                  </p>
                  <p>
                    <span className="font-medium text-primary">
                      Price unit:
                    </span>{" "}
                    {item.priceUnit}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Buyer:</span>{" "}
                    {item.buyer}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Seller:</span>{" "}
                    {item.seller}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default HistoryViews;
