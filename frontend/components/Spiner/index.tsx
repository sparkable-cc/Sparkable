import { RotatingLines } from "react-loader-spinner";
import classNames from "classnames";
import styles from "./index.module.scss";

interface Props {
  sizeWidth?: string
  wrapperClassName?: string
  color?: string
}

export const Spiner = ({ sizeWidth, wrapperClassName, color }: Props) => (
  <div className={classNames(styles.spinerWrapper, wrapperClassName)}>
    <RotatingLines
      strokeColor={color ? color : "#3E6FEF"}
      strokeWidth="5"
      animationDuration="0.75"
      width={sizeWidth || "40"}
      visible
    />
  </div>
);
