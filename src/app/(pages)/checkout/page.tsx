'use client'
import Navbar from "@/components/Navbar";
import ShoppingCart from "@/components/ShoppingCart";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Product {
  name: string;
  price: number | string;
  imageURL: string;
  size: string;
  color: string;
}

const CheckoutPage = () => {
  const [totalPrice, setTotalPrice] = useState<string | number>(0);

  useEffect(() => {
    const storedCheckout = localStorage.getItem("checkout");
    if (storedCheckout) {
      const parsedCheckout = JSON.parse(storedCheckout);

      const calculatedTotalPrice = parsedCheckout.reduce(
        (acc: number, item: Product) => acc + Number(item.price),
        0
      );
      setTotalPrice(calculatedTotalPrice);
    }
  }, []);


  return (
    <div>
      <Navbar />
      <div className="mx-5 w-3/5">
        <h1 className="font-bold text-lg my-3">Shopping Cart</h1>
        
        <div className="flex justify-between">
        <div className="w-3/5 ">
          <ShoppingCart />
        </div>
        <div className="w-60 h-[170px] bg-slate-700 rounded-lg p-4">
          <span>Order Summary</span>
          <div className="flex justify-between">
            <span>Order total</span>
            <span>Rs.{totalPrice}</span>
          </div>
          <Button className="mt-5" variant='outline'>Checkout</Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
