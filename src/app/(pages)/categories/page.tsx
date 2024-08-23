"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { domain } from "@/config/config";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const storeId = localStorage.getItem("storeId");
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // category name

  const [billboard, setBillboard] = useState({
    createdAt: "",
    imageURL: "",
    label: "",
    publicId: "",
    storeId: "",
    updatedAt: "",
  });
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState("");

  // State to track selected filters
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Function to fetch products with the applied filters
  async function fetchProducts({
    size,
    color,
  }: {
    size?: string | null;
    color?: string | null;
  }) {
    try {
      const response = await axios.get(
        `${domain}/api/get-data-by-query?storeId=${storeId}&categoryName=${name}&limit=10&page=1${
          color ? `&color=${color}` : ""
        }${size ? `&size=${size}` : ""}`
      );
      setNotFound("");
      setProducts(response.data.data);
    } catch (error: any) {
      if (error.response.data.message === "No product found") {
        setNotFound(error.response.data.message);
      }
      console.log("Error fetching products: ", error);
    }
  }

  useEffect(() => {
    fetchProducts({});
  }, [name]);

  useEffect(() => {
    const fetchBillboard = async () => {
      const response = await axios.get(
        `${domain}/api/get-billboard-by-category?storeId=${storeId}&categoryName=${name}`
      );
      setBillboard(response.data.data.billboard);
    };
    fetchBillboard();
  }, [name]);

  useEffect(() => {
    const fetchSizes = async () => {
      const response = await axios.get(
        `${domain}/api/get-sizes-by-category?storeId=${storeId}&categoryName=${name}`
      );
      setSizes(response.data.data);
    };
    fetchSizes();
  }, [name]);

  useEffect(() => {
    const fetchColors = async () => {
      const response = await axios.get(
        `${domain}/api/get-colors-by-category?storeId=${storeId}&categoryName=${name}`
      );
      setColors(response.data.data);
    };
    fetchColors();
  }, [name]);

  // Function to filter products by size
  const filterProductBySize = (size: string) => {
    setSelectedSize(size);
    fetchProducts({ size, color: selectedColor });
  };

  // Function to filter products by color
  const filterProductByColor = (color: string) => {
    setSelectedColor(color);
    fetchProducts({ size: selectedSize, color });
  };

  // Function to reset the size filter
  const resetProductForSize = () => {
    setSelectedSize(null);
    fetchProducts({ size: null, color: selectedColor });
  };

  // Function to reset the color filter
  const resetProductForColor = () => {
    setSelectedColor(null);
    fetchProducts({ size: selectedSize, color: null });
  };

  return (
    <>
    <Navbar />
    <div className="mx-10 mt-5">
      <div>
        <div className="relative w-full">
          <img
            src={billboard.imageURL}
            alt="Billboard preview"
            className="w-full h-64 object-cover rounded-md shadow-md"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <div>
              <span className="text-3xl font-semibold text-black">
                {billboard.label}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-5">
        <div className="w-1/6">
          <div>
            <div className="mb-1 flex justify-between">
              <span>Sizes</span>
              {selectedSize && (
                <Button
                  onClick={resetProductForSize}
                  className="h-4 w-4 border-none hover:bg-transparent"
                  variant="outline"
                >
                  ❌
                </Button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size: any) => (
                <Button
                  key={size._id}
                  onClick={() => filterProductBySize(size.name)}
                  variant="outline"
                >
                  {size.value}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between">
              <span>Colors</span>
              {selectedColor && (
                <Button
                  onClick={resetProductForColor}
                  className="h-4 w-4 border-none hover:bg-transparent"
                  variant="outline"
                >
                  ❌
                </Button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color: any) => (
                <Button
                  key={color._id}
                  onClick={() => filterProductByColor(color.name)}
                  variant="outline"
                >
                  {color.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 w-full">
          {notFound ? (
            <div className="flex justify-center items-center w-full">
              <span>{notFound}</span>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default page;
