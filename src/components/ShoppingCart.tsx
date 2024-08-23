"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Product {
  name: string;
  price: number | string;
  imageURL: string;
  size: string;
  color: string;
}

const ShoppingCart = () => {
  const [checkout, setCheckout] = useState<Product[]>([]);

  useEffect(() => {
    const storedCheckout = localStorage.getItem("checkout");
    if (storedCheckout) {
      setCheckout(JSON.parse(storedCheckout));
    }
  }, []);

  const handleDelete = (imageURL: string) => {
    const updatedCheckout = checkout.filter(
      (item) => item.imageURL !== imageURL
    );
    setCheckout(updatedCheckout);
    localStorage.setItem("checkout", JSON.stringify(updatedCheckout));
  };
  return (
    <div className="flex flex-col gap-3 w-full">
      {checkout.map((item) => (
        <div key={item.imageURL}>
          <div className="flex gap-3 w-full">
            <div>
              <Image src={item.imageURL} alt="Item" height={150} width={150} />
            </div>
            <div className="w-72">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{item.name}</span>
                  <span className="font-bold text-sm">Rs.{item.price}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-300 text-xs">{item.color}</span>
                  <span className="text-gray-300 text-xs">{item.size}</span>
                </div>
                <div>
                  <Button
                    onClick={() => handleDelete(item.imageURL)}
                    className="rounded-full h-8 w-8 flex items-center justify-center text-xs"
                  >
                    X
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;
