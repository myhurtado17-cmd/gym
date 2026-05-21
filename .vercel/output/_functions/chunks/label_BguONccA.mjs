import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { e as cn } from './card_C1ViycoZ.mjs';
import * as LabelPrimitive from '@radix-ui/react-label';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      type,
      "data-slot": "input",
      className: cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  );
});
Input.displayName = "Input";

const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    "data-slot": "label",
    className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Input as I, Label as L };
