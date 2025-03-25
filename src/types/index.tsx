import { ReactNode } from "react";

export interface inputProps {
  name: string;
  type: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export interface formProps {
  children: ReactNode;
  action: (formData: FormData) => Promise<void>;
  className?: string;
  onSubmit?: () => void;
}

export interface buttonProps {
  type?: "button" | "submit" | "reset";
  children: ReactNode;  // Replaced 'text' with standard 'children'
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export interface todoProps {
  id: string;
  title?: string | null;
  isCompleted: boolean;
  createdAt?: Date | string;
}