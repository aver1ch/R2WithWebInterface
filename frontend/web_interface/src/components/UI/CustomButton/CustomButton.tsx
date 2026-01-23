import styles from "./CustomButton.module.css";
import cn from "classnames";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomButton = ({ children, className, style, ...props }: CustomButtonProps) => {
  return (
    <button {...props} className={cn(styles.button, className)} style={style}>
      {children}
    </button>
  );
};

export default CustomButton;
