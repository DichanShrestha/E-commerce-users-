"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { domain } from "@/config/config";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

function page() {
  const storeId = localStorage.getItem("storeId");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${domain}/api/get-data-for-store?storeId=${storeId}&page=1&limit=10`
      );
      console.log(response);
      setProducts(response.data.data);
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  return (
    <div>
      <Navbar />
      <div className="mx-5">
        <div className="relative w-full my-2">
          <Image
            src="https://res.cloudinary.com/dn55mzlnu/image/upload/v1724327010/en7cdfrg5zw2jwygwtmw.jpg"
            alt="Billboard preview"
            className="w-full h-64 object-cover rounded-md shadow-md"
            width={100}
            height={100}
          />

          <div className="absolute inset-0 flex justify-center items-center">
            <div>
              <span className="text-3xl font-semibold text-black">
                Explore The Special Collection
              </span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-bold text-lg">Featured Products</h1>
          <div className="flex flex-wrap gap-5 mt-1">
            {products.map((product: any) => (
              <div key={product._id}>
                <ProductCard
                  size={product.size}
                  color={product.color}
                  category={product.category}
                  imageURL={product.imageURL}
                  name={product.name}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
