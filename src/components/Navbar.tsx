"use client";
import { domain } from "@/config/config";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuShoppingCart } from "react-icons/lu";

interface Category {
  _id: string;
  title: string;
  href: string;
}

interface Product {
  name: string;
  price: number | string;
  imageURL: string;
  size: string;
  color: string;
}

export default function Navbar() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [checkout, setCheckout] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch storeId from localStorage on the client side
    const id = localStorage.getItem("storeId");
    setStoreId(id);

    // Fetch checkout items from localStorage
    const storedCheckout = localStorage.getItem("checkout");
    if (storedCheckout) {
      setCheckout(JSON.parse(storedCheckout));
    }

    // Listen for changes to localStorage
    const handleStorageChange = () => {
      const updatedCheckout = localStorage.getItem("checkout");
      if (updatedCheckout) {
        setCheckout(JSON.parse(updatedCheckout));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (storeId) {
        try {
          const response = await axios.get(
            `${domain}/api/categories/${storeId}`
          );
          const filteredData = response.data.data.map((item: any) => ({
            _id: item._id,
            title: item.name,
            href: `/categories?name=${item.name}`,
          }));
          setCategories(filteredData);
        } catch (error: any) {
          console.log("Error fetching categories: ", error.message);
        }
      }
    };

    fetchCategories();
  }, [storeId]);

  return (
    <div className="h-10 max-w-screen flex items-center justify-between mx-5">
      <div className="flex gap-5">
        {storeId && (
          <Link href={`/store?id=${storeId}`} className="font-bold text-lg">
            Store
          </Link>
        )}
        {categories.map((category) => (
          <div key={category._id}>
            <Link href={category.href} className={`text-sm`}>
              {category.title}
            </Link>
          </div>
        ))}
      </div>

      <Link href='/checkout' className="relative">
        <LuShoppingCart className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        <div className="absolute -right-1 bottom-0 bg-white text-xs text-black dark:text-white dark:bg-gray-800 rounded-full h-4 w-4 flex items-center justify-center shadow-md">
          {checkout.length}
        </div>
      </Link>
    </div>
  );
}
