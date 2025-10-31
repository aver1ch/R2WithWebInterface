import React from "react";
import styles from "./Title.module.css";
import cn from "classnames";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title = ({ children, className, ...props }: TitleProps) => {
  return <h1 className={cn(styles.title, className)}>{children}</h1>;
};

export default Title;
