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
      className="p-1 mb-6"
      onClick={() => router.push("/")}
      aria-label="ホームに戻る"
    >
      <Home className="w-6 h-6" />
    </Button>
  );
} 