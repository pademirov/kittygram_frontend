import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../utils/context";

import { likeCard } from "../../utils/api";
import defaultImg from "../../images/default-kitty.jpg";

import styles from "./main-card.module.css";

export const MainCard = ({ cardId, name = "", date = "", color = "Бежевый", img, extraClass = "", likesCount = 0, onUnlike, likedBy = [], }) => {
  const [likes, setLikes] = React.useState(likesCount);
  const [liked, setLiked] = React.useState(false);
  const [user] = React.useContext(UserContext);
  console.log('user from context:', user);


  const colorText =
    color === "black" ||
    color === "saddlebrown" ||
    color === "gray" ||
    color === "darkgray"
      ? "white"
      : "primary";

  const handleLike = (e) => {
    e.preventDefault();
    likeCard(cardId).then((res) => {
      if (res.detail === 'Лайк поставлен.') {
        setLikes(likes + 1);
        setLiked(true);
      } else {
        setLikes(likes - 1);
        setLiked(false);
        if (onUnlike) onUnlike(cardId);
      }
    });
  };

  React.useEffect(() => {
    setLikes(likesCount);
    setLiked(likedBy.some(l => l.username === user.username));
  }, [likesCount, likedBy, user.username]);

  return (
    <article className={`${styles.content} ${extraClass}`}>
      <Link className={styles.link} to={`/cats/${cardId}`}>
        <img
          className={styles.img}
          src={img ?? defaultImg}
          alt="Фото котика."
        />
      </Link>
      <div className={styles.data_box}>
        <div className={styles.name_n_date_box}>
          <p
            className={`text text_type_h3 text_color_primary mt-8 mb-3 ${styles.name}`}
          >
            {name}
          </p>
          <p
            className={`text text_type_medium-20 text_color_secondary mb-8 ${styles.date}`}
          >
            {date}
          </p>
        </div>
        <div className={styles.cat_info_block}>
          <div
            className={styles.cat_color_box}
            style={{ backgroundColor: color }}
          >
            <p
              className={`text text_type_medium-20 text_color_${colorText} ${styles.cat_color}`}
            >
              {color}
            </p>
          </div>
          <button
            onClick={handleLike}
            className={liked ? styles.like_btn : styles.like_btn_inactive}
          >
            {liked ? '❤️' : '🤍'} {likes}
          </button>
        </div>
      </div>
    </article>
  );
};
