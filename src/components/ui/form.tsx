import * as React from "react";
import { cn } from "@/lib/utils";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  "data-test-id"?: string;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(({ className, "data-test-id": testId, ...props }, ref) => {
  // Upewniamy się, że method jest ustawione na POST
  const formProps = {
    ...props,
    method: props.method || "POST",
  };

  return <form ref={ref} className={cn("space-y-6", className)} role="form" data-test-id={testId} {...formProps} />;
});
Form.displayName = "Form";

const FormSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-4", className)} {...props} />
);
FormSection.displayName = "FormSection";

const FormGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2", className)} {...props} />
);
FormGroup.displayName = "FormGroup";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label ref={ref} className={cn("block text-sm font-medium text-gray-700", className)} {...props}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <p ref={ref} className={cn("text-sm font-medium text-red-500", className)} {...props}>
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

const FormActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-end gap-3 pt-6", className)} {...props} />
  )
);
FormActions.displayName = "FormActions";

export { Form, FormSection, FormGroup, FormLabel, FormDescription, FormMessage, FormActions };
