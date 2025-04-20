import { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent ${
          className || ""
        }`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
