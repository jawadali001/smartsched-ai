"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full"
    >
      ←
    </button>
  );
}