import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import arrowLeft from './img/header/arrow-left.svg';
import home from './img/header/home.svg';
import tool from './img/slider/tool.svg';
import map from './img/map/map.svg';
import useFetch from '../../components/hooks/useFetch.js';
import FilterPage from '../filterPage/Filter.jsx';
import SortedPosts from '../../components/SortedPosts.jsx';
import cl from './page2.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveCategoryt,
  setCategoryTitle,
  setCategoryTitled,
  setSelectedSubcategory,
  setSelectedSubsubcategory
} from '../../actions.js';
import Loader from '../../components/UI/Loader/Loader.jsx';

const InfoPage = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const { activeCategoryId } = useParams();
  const [prevCategories, setPrevCategories] = useState([]);
  const [categoryTitles, setCategoryTitles] = useState({});
  const buttonRef = useRef(null);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  }, [buttonRef]);
  useEffect(() => {
    console.log('categoryId:', activeCategoryId);
  }, [activeCategoryId]);


  const handleGoBack = () => {
    if (prevCategories.length > 0) {
      const lastCategory = prevCategories.pop();
      setActiveCategory(lastCategory);
      setPrevCategories([...prevCategories]);
      const path = `/page2/${lastCategory}`;
      window.history.pushState(null, '', path);
      setTimeout(() => {
        scrollToActiveCategory();
      }, 100);
    } else {
      const path = '/';
      window.history.pushState(null, '', path);
    }
  };

  const scrollToActiveCategory = () => {
    const tabsBox = document.querySelector(`.${cl.tabs_box}`);
    const activeTab = document.querySelector(`.${cl.tab}.${cl.active}`);

    if (tabsBox && activeTab) {
      const scrollOffset = activeTab.offsetLeft - (tabsBox.clientWidth - activeTab.clientWidth) / 2;
      tabsBox.scrollTo({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  const [categoryPosts, setCategoryPosts] = useState([]);
  const [categoryError, setCategoryError] = useState(null);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const pathParts = location.pathname.split('/');
  const encodedCategory = pathParts[pathParts.length - 1];
  const initialCategoryId = categoryTitles[encodedCategory] || encodedCategory;

  const { data, loading } = useFetch(
      'https://spbneformal.fun/api/categories?populate=image'
  );
  const pizda = useSelector(state => state.title.categoryTitled);
  const [activeCategory, setActiveCategory] = useState(initialCategoryId);
  const [localCategoryTitle, setLocalCategoryTitle] = useState(initialCategoryId);
  const categoryTitleRedux = useSelector((state) => state?.title?.categories[activeCategory]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [sortState, setSortState] = useState(false)

  const subcategoryId = useSelector((state) => state?.title?.selectedSubcategory)

  const handleSortState = () => {
    setSortState(prevState => !prevState)
  }
  const [activeCategoryd, setActiveCategoryd] = useState('');

  useEffect(() => {
    // Получаем активный путь из URL-адреса
    const activePath = location.pathname.split('/')[2]; // Предполагается, что активный путь находится на второй позиции в URL

    // Устанавливаем активную категорию, если она есть
    if (activePath) {
      setActiveCategory(activePath);
    }
  }, [location.pathname]);
  const loopClick = () => {
    setShowFilterPage(true);
    document.body.style.overflow = 'hidden';
  };


  const handleFilterPageClose = () => {
    setShowFilterPage(false);
    document.body.style.overflow = 'auto';

  };

  const fetchPostsForCategory = async (categoryId) => {
    try {
      const response = await fetch(
          `https://spbneformal.fun/api/categories/${categoryId}?populate=posts`
      );
      const categoryData = await response.json();

      const posts = categoryData?.attributes?.posts?.data || [];
      setCategoryPosts(posts);
      setCategoryError(null);
    } catch (error) {
      setCategoryError('Error fetching category data');
      setCategoryPosts([]);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const titles = {};
      data.forEach((category) => {
        dispatch(setCategoryTitle(category.id, category.attributes.title));
        titles[category.id] = category.attributes.title;
      });

      setCategoryTitles(titles);
      scrollToActiveCategory();
    }
  }, [data]);


  const handleCategoryClick = async (categoryId, categoryTitle) => {
    if (activeCategory === categoryId) {
      return;
    }
    handleSelectedCategoryChange()

    setPrevCategories([...prevCategories, activeCategory]);
    document.querySelectorAll(`${cl.card__item}`).forEach((tab) => {
      tab.classList.remove(cl.active);
    });
    setActiveCategory(categoryId);
    setLocalCategoryTitle(categoryTitle); // Установить локальный заголовок категории
    await fetchPostsForCategory(categoryId);
    dispatch(setCategoryTitled('')); // Очистить значение в Redux
  };
  const clearLocalStorage = () => {
    localStorage.removeItem('selectedCategoryId');
    localStorage.removeItem('selectedSubcategory');
  };
  const handleSelectedCategoryChange = (categoryId) => {
    // Сбросить выбранные подкатегории и подподкатегории
    dispatch(setSelectedSubcategory(null));
    dispatch(setSelectedSubsubcategory(null));

    // Добавить другие действия, если необходимо
    console.log("Selected category changed:", categoryId);
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Сброс значения pizda при размонтировании компонента

  console.log(sortState)
  const categoryId = pathParts[pathParts.length - 1];
  console.log(categoryId + "seks")
  useEffect(() => {
    dispatch(setActiveCategoryt(categoryId))
  }, [categoryId]);
  useEffect(() => {
    scrollToActiveCategory();
  }, [activeCategory,categoryId]);
  return (
      <>
        <div>
          {showFilterPage && (
              <div className={cl.filterPageOverlay}>
                <div className={cl.modalContainer} onClick={handleFilterPageClose}>
                  <FilterPage handleSortState={handleSortState} handleFilterPageClose={handleFilterPageClose} activeCategory={categoryId}  />
                </div>
              </div>
          )}
          <header className={cl.header}>
            <div className={`${cl.header__container} ${cl._container}`}>
              <a href="#" className={cl.header__icon} onClick={handleGoBack}>
                <img src={arrowLeft} alt="" />
              </a>
              <Link to={"/"} className={cl.header__icon}>
                <img src={home} alt="" />
              </Link>
            </div>
          </header>

          <section className={`${cl.page__food} ${cl.food}`}>
            <div className={`${cl.wrapper} ${cl._container}`}>
              {loading ? (
                  <div className={cl.loaderContainer}>
                    <Loader />
                  </div>
              ) : (
                  <ul className={cl.tabs_box}>
                    {data &&
                        data.map((cat) => (
                            <Link
                                to={`/page2/${cat.id}`}
                                key={cat.id}
                                className={`${cl.tab} ${location.pathname.includes(`/page2/${cat.id}`) ? cl.active : ''}`}
                                onClick={() => handleCategoryClick(cat.id, cat.attributes.title)}
                                data-category={cat.id}
                            >

                              <img
                                  className={cl.button__image}
                                  src={`https://uploads.spbneformal.fun${cat.attributes.image.data.attributes.url}`}
                                  alt=""
                              />
                              <span className={`${cl.tab__text} ${cl.tab3}`}>{cat.attributes.title}</span>
                            </Link>
                        ))}
                  </ul>
              )}
            </div>

            <div className={`${cl.food__header} ${cl._container}`}>
              <div className={cl.food__content}>
                <div  className={cl.food__title}>{pizda || categoryTitleRedux }</div>
                <div className={cl.food__desc}>Нажмите на кнопку «фильтры», чтобы выбрать наиболее подходящее место</div>
              </div>
              <div className={cl.food__icon}>
                <img onClick={() => {loopClick(); setSortState(false)}} src={tool} alt="" />
              </div>
            </div>
            {(categoryTitleRedux || localCategoryTitle) && (
                <SortedPosts setSortState={setSortState} sortState={sortState} fId={categoryId} categoryId={activeCategory} categoryTitle={localCategoryTitle} posts={categoryPosts} />
            )}
          </section>

          <section className={`${cl.page__map} ${cl.map}`}>
            <div className={`${cl.map__container} ${cl._container}`}>
              <div className={cl.map__content}>
                <div className={cl.map__title}>Онлайн-карта</div>
                <div className={cl.map__desc}>
                  Интерактивная карта в Google Maps с местами города. Ищите новые места{' '}
                  <p>рядом с вами!</p>
                </div>
              </div>
              <img src={map} alt="" />
              <a href="https://www.google.com/maps/d/u/0/viewer?mid=1nDV5H0tZuNOTJazCwoLd1QjHtjE3GN7A&ll=59.93486030000001%2C30.3173047&z=11" target="_blank" className={cl.map_btn}>ОТКРЫТЬ ОНЛАЙН-КАРТУ</a>
            </div>
          </section>
        </div>
      </>
  );
};

export default InfoPage;