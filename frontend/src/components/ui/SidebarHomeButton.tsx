"use client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SidebarHomeButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 p-1 mb-2"
      onClick={() => router.push("/")}
      aria-label="ホームに戻る"
    >
      <Home className="w-8 h-8" />
    </Button>
  );
} 