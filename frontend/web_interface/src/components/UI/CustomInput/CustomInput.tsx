import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./CustomInput.module.css";
import cn from "classnames";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement>;

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, ...rest }, ref) => {
    return <input ref={ref} {...rest} className={cn(styles.input, className)} />;
  }
);