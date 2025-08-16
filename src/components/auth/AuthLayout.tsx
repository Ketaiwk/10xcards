import type { PropsWithChildren } from "react";
import { Card } from "@/components/ui/card";
import { IconWrapper } from "@/components/common/IconWrapper";
import { ShieldCheck } from "lucide-react";

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" data-test-id="auth-layout">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <IconWrapper icon={ShieldCheck} className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>

        <Card className="p-6">
          <div className="w-full">{children}</div>
        </Card>

        {/* Logo i dodatkowe informacje */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <span>10xCards</span>
            <span className="text-gray-300">•</span>
            <a href="/" className="hover:text-primary transition-colors" aria-label="Przejdź do strony głównej">
              Strona główna
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
