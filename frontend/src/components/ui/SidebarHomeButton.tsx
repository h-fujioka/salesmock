"use client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function SidebarHomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/";

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      className={`p-1 mb-6 ${isActive ? "bg-blue-100 text-blue-700" : ""}`}
      onClick={() => router.push("/")}
      aria-label="ホームに戻る"
    >
      <Home className="w-6 h-6" />
    </Button>
  );
} 