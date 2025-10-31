import styles from "./CustomButton.module.css";
import cn from "classnames";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomButton = ({ children, className, ...props }: CustomButtonProps) => {
  return (
    <button {...props} className={cn(styles.button, className)}>
      {children}
    </button>
  );
};

export default CustomButton;
