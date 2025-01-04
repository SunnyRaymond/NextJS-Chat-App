"use client";

import { Card } from "@/components/ui/card";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  Action?: React.ReactNode;
}>;

const ItemList = ({ children, title, Action }: Props) => {
  const { isActive } = useConversation();
  return (
    <Card
      className={cn(
        "hidden min-h-[calc(100vh-110px)] w-full lg:flex-none lg:w-80 p-2",
        {
          block: !isActive,
          "lg:block": isActive,
        }
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {Action ? Action : null}
      </div>
      <div className="w-full h-full flex flex-col items-center justify-start gap-2">
        {children}
      </div>
    </Card>
  );
};

export default ItemList;