import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./button-favorite.module.css";

export const ButtonFavorite = ({
  isLogin = false,
  text = "",
  icon,
  to = "/signin",
  extraClass = "",
  ...rest
}) => {
  return (
    <NavLink to={to} className={`${styles.button} ${extraClass}`} {...rest}>
      <p
        className={`text text_type_large pl-4 ${styles.text} ${
          !text && styles.none
        } ${isLogin && styles.hidden}`}
      >
        {text}
      </p>
    </NavLink>
  );
};