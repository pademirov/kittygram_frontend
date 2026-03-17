import React from "react";
import { getMyCats } from "../../utils/api";
import { MainCard } from "../main-card/main-card";
import { PaginationBox } from "../pagination-box/pagination-box";
import styles from "./my-cats-page.module.css";

export const MyCatsPage = ({ extraClass = "" }) => {
  const [cards, setCards] = React.useState([]);
  const [pagData, setPagData] = React.useState({});
  const [queryPage, setQueryPage] = React.useState(1);

  React.useEffect(() => {
    getMyCats(queryPage).then((res) => {
      if (res.results) {
        setPagData({
          count: res.count,
          pages: Math.ceil(res.count / 10),
        });
        setCards(res.results);
      }
    }).catch((err) => {
      if (err.detail === "Invalid page.") {
        getMyCats(queryPage - 1).then((res) => {
          setQueryPage(queryPage - 1);
          setPagData({
            count: res.count,
            pages: Math.ceil(res.count / 10),
          });
          setCards(res.results);
        });
      }
    });
  }, [queryPage]);

  return (
    <section className={`${styles.content} ${extraClass}`}>
      <h2 className={`text text_type_h2 text_color_primary mt-25 mb-20`}>
        Мои коты
      </h2>
      <div className={styles.box}>
        {cards.length === 0 && (
          <p className="text text_type_h3 text_color_secondary">
            Вы ещё не добавили ни одного кота
          </p>
        )}
        {cards.map((item) => (
          <MainCard
            cardId={item.id}
            key={item.id}
            img={item.image}
            name={item.name}
            date={item.birth_year}
            color={item.color}
            likesCount={item.likes_count}
            likedBy={item.liked_by || []}
          />
        ))}
      </div>
      {pagData.count > 10 && (
        <PaginationBox
          data={pagData}
          queryPage={queryPage}
          setQueryPage={setQueryPage}
        />
      )}
    </section>
  );
};