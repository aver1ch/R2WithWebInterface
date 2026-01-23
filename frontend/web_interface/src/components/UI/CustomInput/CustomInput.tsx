import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./CustomInput.module.css";
import cn from "classnames";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement>;

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props: any, ref) => {
    return <input ref={ref} {...props} className={cn(styles.input, props.className)} />;
  }
);
