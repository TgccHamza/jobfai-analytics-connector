
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";

const headerVariants = cva(
  "flex flex-col items-start justify-between space-y-2 pb-4 animate-fade-in",
  {
    variants: {
      spacing: {
        default: "pb-4",
        sm: "pb-3",
        lg: "pb-6",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
);

interface PageHeaderProps extends VariantProps<typeof headerVariants> {
  heading: string;
  description?: string;
  children?: React.ReactNode;
  separator?: boolean;
}

export function PageHeader({
  heading,
  description,
  children,
  separator = true,
  spacing,
}: PageHeaderProps) {
  return (
    <div className={cn(headerVariants({ spacing }))}>
      <div className="flex flex-col space-y-1 w-full">
        {heading && (
          <h1 className="font-semibold text-2xl md:text-3xl transition-all duration-200">
            {heading}
          </h1>
        )}
        {description && (
          <p className="text-muted-foreground text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-4 w-full md:justify-end">
          {children}
        </div>
      )}
      {separator && <Separator className="mt-4" />}
    </div>
  );
}
