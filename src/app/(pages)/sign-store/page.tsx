"use client";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const signStore = () => {
  const { setStoreId } = useUserStore();
  const [storeID, setStoreID] = useState<string>("");
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("storeId", storeID);
    router.replace(`store?id=${storeID}`);
  };

  return (
    <div>
      <div className="flex justify-center align-middle">
        <Input
          value={storeID}
          onChange={(e) => {
            setStoreID(e.target.value);
          }}
        />
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-20 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          onClick={handleClick}
        >
          click
        </button>
      </div>
    </div>
  );
};

export default signStore;
