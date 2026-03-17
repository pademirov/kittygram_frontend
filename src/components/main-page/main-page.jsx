import React from "react";
import { getCards } from "../../utils/api";
import { MainCard } from "../main-card/main-card";
import { PaginationBox } from "../pagination-box/pagination-box";
import styles from "./main-page.module.css";

export const MainPage = ({ queryPage, setQueryPage, extraClass = "" }) => {
  const [cards, setCards] = React.useState([]);
  const [pagData, setPagData] = React.useState({});
  const [ordering, setOrdering] = React.useState('-likes_count');
  const [colors, setColors] = React.useState([]);

  const colorOptions = [
    { value: 'red', label: 'Красный' },
    { value: 'black', label: 'Чёрный' },
    { value: 'white', label: 'Белый' },
    { value: 'gray', label: 'Серый' },
    { value: 'orange', label: 'Оранжевый' },
    { value: 'bisque', label: 'Бежевый' },
    { value: 'saddlebrown', label: 'Коричневый' },
  ];

  const handleColorChange = (value) => {
    if (colors.includes(value)) {
      setColors(colors.filter(c => c !== value));
    } else {
      setColors([...colors, value]);
    }
    setQueryPage(1);
  };

  React.useEffect(() => {
    getCards(queryPage, ordering, colors)
      .then((res) => {
        setPagData({
          count: res.count,
          pages: Math.ceil(res.count / 10),
        });
        setCards(res.results);
      })
      .catch((err) => {
        if (err.detail === "Invalid page.") {
          getCards(queryPage - 1, ordering, colors)
            .then((res) => {
              setQueryPage(queryPage - 1);
              setPagData({
                count: res.count,
                pages: Math.ceil(res.count / 10),
              });
              setCards(res.results);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          console.error(err);
        }
      });
  }, [queryPage, setQueryPage, ordering, colors]);

  return (
    <section className={`${styles.content} ${extraClass}`}>
      <div className={styles.filters}>
        <div className={styles.filters_row}>
          <h2 className={`text text_type_h2 text_color_primary ${styles.title}`}>
            Замечательные коты
          </h2>
          <div className={styles.filters_content}>
            <select
              className={styles.select}
              value={ordering}
              onChange={(e) => { setOrdering(e.target.value); setQueryPage(1); }}
            >
              <option value="-likes_count">❤️ По лайкам </option>
              <option value="likes_count">🤍 Меньше лайков</option>
              <option value="-id">Новые</option>
              <option value="id">Старые</option>
            </select>
            <div className={styles.checkboxes}>
              {colorOptions.map(option => (
                <button
                  key={option.value}
                  title={option.label}
                  onClick={() => handleColorChange(option.value)}
                  className={`${styles.color_dot} ${colors.includes(option.value) ? styles.color_dot_active : ''}`}
                  style={{ backgroundColor: option.value }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.box}>
        {cards.map((item, index) => {
          return (
            <MainCard
              cardId={item.id}
              key={index}
              img={item.image}
              name={item.name}
              date={item.birth_year}
              color={item.color}
              likesCount={item.likes_count}
              likedBy={item.liked_by}
            />
          );
        })}
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
