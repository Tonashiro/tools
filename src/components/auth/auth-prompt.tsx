"use client";

import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface AuthPromptProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText?: string;
  className?: string;
}

export function AuthPrompt({
  title,
  description,
  icon: Icon,
  buttonText = "Sign in with Discord",
  className = "",
}: AuthPromptProps) {
  return (
    <div className={`max-w-md mx-auto text-center ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Icon className="h-6 w-6" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => signIn("discord")} className="w-full">
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 