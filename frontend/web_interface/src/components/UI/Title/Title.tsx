import React from "react";
import styles from "./Title.module.css";
import cn from "classnames";

interface TitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Title = ({ children, className, style, ...props }: TitleProps) => {
  return <h1 className={cn(styles.title, className)} style={style}>{children}</h1>;
};

export default Title;
