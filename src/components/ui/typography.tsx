import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

const elementClasses = {
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-2xl",
  h4: "text-xl",
  h5: "text-lg",
  h6: "text-base",
  p: "leading-7",
};

type TProps = ComponentPropsWithoutRef<"p"> & {
  children: React.ReactNode;
  type?: keyof typeof elementClasses;
};
export function Typography({ className, children, ...props }: TProps) {
  const Component = props.type || "p";
  return (
    <Component
      className={cn(
        Component !== "p" && "scroll-m-20 font-semibold tracking-wider",
        elementClasses[Component],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

Typography.displayName = "Typography";
