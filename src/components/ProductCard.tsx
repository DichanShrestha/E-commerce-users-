"use client";
import { MdOutlineZoomOutMap, MdOutlineShoppingCart } from "react-icons/md";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

interface Product {
  name: string;
  price: string | number;
  imageURL: string;
  size: string;
  color: string;
}

const ProductCard = ({
  size,
  color,
  imageURL,
  name,
  category,
  price,
}: {
  size: string;
  imageURL: string;
  color: string;
  name: string;
  category: string;
  price: string | number;
}) => {
  const [checkout, setCheckout] = useState<Product[]>([]);
  const {toast} = useToast()
  // Function to add product to checkout and save to localStorage
  const addToCart = () => {
    const product = {
      name,
      price,
      imageURL,
      size,
      color,
    };

    // Get the current checkout from localStorage
    const currentCheckout = JSON.parse(localStorage.getItem("checkout") || "[]");

    // Append the new product to the checkout array
    const updatedCheckout = [...currentCheckout, product];

    toast({
      title: 'Success',
      description: 'Item added to cart'
    })

    // Update the state and localStorage
    setCheckout(updatedCheckout);
    localStorage.setItem("checkout", JSON.stringify(updatedCheckout));

    // Trigger the storage event manually for the same page
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="border-gray-600 border-[1px] rounded-md h-[280px] w-56">
      <div className="p-4">
        <div className="relative w-full h-full group">
          <img
            className="h-[180px] w-52 transition duration-300 ease-in-out group-hover:opacity-70"
            src={imageURL}
            alt={name}
          />
          <div className="absolute bottom-3 left-10 flex gap-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-transparent">
                  <MdOutlineZoomOutMap className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex gap-4 p-6 ">
                  <div className="h-[180px] w-52 overflow-hidden relative">
                    <Image
                      alt="items"
                      src={imageURL}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>

                  <div className="w-full">
                    <h1 className="font-bold text-lg">{name}</h1>
                    <p className="text-sm mt-1">Rs.{price}</p>
                    <hr className="my-4" />
                    <p>Size: {size}</p>
                    <div className="my-4 flex gap-1 text-sm">
                      <span>Color: {color}</span>
                      <div
                        style={{ backgroundColor: color }}
                        className="h-5 w-5 border-black border-[1px] rounded-full"
                      ></div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={addToCart}>
                    Add to cart{" "}
                    <MdOutlineShoppingCart className="h-4 w-4 ml-2" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              className="bg-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-transparent"
              onClick={addToCart}
            >
              <MdOutlineShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <h2 className="font-bold">{name}</h2>
          <p className="text-sm text-gray-500">{category}</p>
          <p className="font-bold text-sm">Rs.{price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
