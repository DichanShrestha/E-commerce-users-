"use client";
import Navbar from "@/components/Navbar";
import ShoppingCart from "@/components/ShoppingCart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { domain } from "@/config/config";
import axios from "axios";
import { useSearchParams } from "next/navigation";
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
  const [formData, setFormData] = useState<any>("");
  const [storedCheckout, setStoredCheckout] = useState<any>();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  useEffect(() => {
    const checkout = localStorage.getItem("checkout")
    setStoredCheckout(checkout);
  }, []);

  useEffect(() => {
    (async () => {
      if (data) {
        const decodedString = atob(data);
        const decodedData = JSON.parse(decodedString);
        console.log(decodedData);
        
        if (decodedData.status === "COMPLETE") {
          const response = await axios.patch(
            `${domain}/api/esewa/success`,
            {
              transaction_uuid: formData.transaction_uuid,
              transaction_code: formData.transaction_code,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response);
          
          localStorage.removeItem("checkout");
          setStoredCheckout("");
          toast({
            title: "Success",
            description: "Payment completed",
          });
        }
      }
    })();
  }, [storedCheckout]);

  useEffect(() => {
    const handleStorageChange = () => {      
      if (storedCheckout) {
        const parsedCheckout = JSON.parse(storedCheckout);

        const calculatedTotalPrice = parsedCheckout.reduce(
          (acc: number, item: Product) => acc + Number(item.price),
          0
        );
        setTotalPrice(calculatedTotalPrice);
      }
    };

    handleStorageChange();
  }, [storedCheckout]);

  const handlePayment = async () => {
    const orderDetails = {
      payment_method: "esewa",
      amount: totalPrice,
      products: [{ product: "Test Product", quantity: 1 }],
      address: "Test Address",
    };

    try {
      const response = await axios.post(
        `${domain}/api/esewa/initiate-payment`,
        orderDetails
      );
      const formData = response.data.formData;
      setFormData(formData);

      const form = document.createElement("form");
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      form.method = "POST";

      for (const key in formData) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mx-5 w-4/5">
        <h1 className="font-bold text-lg my-3">Shopping Cart</h1>

        <div className="flex justify-between gap-20">
          <div className="w-3/5 ">
            <ShoppingCart />
          </div>
          <div className="w-60 h-[170px] bg-slate-700 rounded-lg p-4">
            <span>Order Summary</span>
            <div className="flex justify-between">
              <span>Order total</span>
              <span>Rs.{totalPrice}</span>
            </div>
            <Button
              onClick={handlePayment}
              className="mt-5"
              variant="outline"
              disabled={totalPrice === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
