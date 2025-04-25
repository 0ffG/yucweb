import * as React from "react";

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export type ToastActionElement = React.ReactElement;
