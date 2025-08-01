import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

const notificationVariants = cva(
  // Base styles
  "relative flex items-start gap-3 rounded-none border px-4 py-3",
  {
    variants: {
      variant: {
        info: ["bg-blue-50 border-blue-600", "text-blue-900"],
        success: ["bg-green-50 border-green-600", "text-green-900"],
        warning: ["bg-yellow-50 border-yellow-600", "text-yellow-900"],
        error: ["bg-red-50 border-red-600", "text-red-900"],
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

interface NotificationProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof notificationVariants> {
  title?: string;
  onClose?: () => void;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant = "info", title, children, onClose, ...props }, ref) => {
    const IconComponent = notificationIcons[variant || "info"];

    return (
      <div ref={ref} className={cn(notificationVariants({ variant }), className)} role="alert" {...props}>
        <IconComponent className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {title && <div className="font-medium mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
            <XCircle className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    );
  }
);
Notification.displayName = "Notification";

export { Notification };
export type { NotificationProps };
