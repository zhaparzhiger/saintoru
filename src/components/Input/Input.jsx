import React, { useState, useEffect } from "react";
import cl from "./input.module.css";
import loop from "../../Home/categoryPage/imgs/header/loop.svg";
import arrowLeft from "../../Home/page3/img/arrow-left.svg";
import home from "./img/icons.svg";
import { Link } from "react-router-dom";
import yellow_heart from "../../Home/categoryPage/imgs/main/section__publications/icons/yellow_heart.svg";
import heart from "../../Home/page2/img/food/heart.svg";
import axios from "axios";
import { useLocation } from "react-router-dom";

import {
  resetButton,
  setButtonPressed,
  setButtons,
} from "../../features/buttonSlide.js";
import useFetch from "../hooks/useFetch.js";
import { useDispatch, useSelector } from "react-redux";
import sun1 from "./img/sun.svg";
import yellow_like from "../../Home/categoryPage/imgs/main/section__publications/icons/yellow_heart.svg";
import {useFetchPupsik} from "../hooks/useFetchPupsik.js";
const Input = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pageSize = 20; // или любое другое значение, которое вам нужно
  const [totalPosts, setTotalPosts] = useState(0);

  const [searchResults, setSearchResults] = useState({ data: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { buttons } = useSelector((state) => state.button);
  const dispatch = useDispatch();
  const [allData, setAllData] = useState([]);
  const [loadedPostIds, setLoadedPostIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, eloading, error } = useFetch(
      `https://spbneformal.fun/api/posts?populate=*&pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort[0]=createdAt:desc`
  );

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const categoryId = queryParams.get("categoryId");

  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);

  // ...




  console.log(categoryId)

  const handleInputClick = () => {
    setIsFullscreen(true);
  };
  const processSearchResults = (prevResults, newData) => {
    const uniqueData = newData.data.filter((newPost) => {
      return !prevResults?.data?.some(
          (existingPost) => existingPost.id === newPost.id
      );
    });

    return {
      data: [...(prevResults?.data || []), ...uniqueData],
    };
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const apiUrl = "https://spbneformal.fun/api/posts";
      const queryParams = new URLSearchParams({
        "sort[0]": "createdAt:desc",
        populate: "*",
        "pagination[pageSize]": pageSize,
        "pagination[page]": page,
        "filters[title][$contains]": searchQuery,
      });
      const fullUrl = `${apiUrl}?${queryParams.toString()}`;

      console.log(fullUrl)
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);

      setTotalPosts(data.total); // Устанавливаем общее количество постов

      setSearchResults((prevResults) => processSearchResults(null, data));


      const newPostIds = data.data.map((post) => post.id);
      setLoadedPostIds((prevIds) => [...prevIds, ...newPostIds]);
      setSearchResults((prevResults) =>
          processSearchResults(prevResults, data)
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim().length > 2) {
      setPage(1);
      handleSearch();
    }
  };

  const handleLoadMore = async () => {
    if (searchQuery.trim().length > 2) {
    try {
      setLoading(true);
      const apiUrl = "https://spbneformal.fun/api/posts";
      const queryParams = new URLSearchParams({
        "sort[0]": "createdAt:desc",
        populate: "*",
        "filters[title][$contains]": searchQuery,
        "pagination[pageSize]": pageSize,
        "pagination[page]": page + 1,
      });
      const fullUrl = `${apiUrl}?${queryParams.toString()}`;

      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);

      setLoadedPostIds((prevIds) => {
        const newPostIds = data.data.map((post) => post.id);
        return [...prevIds, ...newPostIds];
      });

      setSearchResults((prevResults) => {
        const uniqueData = data.data.filter((newPost) => {
          return !loadedPostIds.includes(newPost.id);
        });

        return {
          data: [...prevResults.data, ...uniqueData],
        };
      });
      setCurrentPage((prevPage) => prevPage + 1);
      setLoading(false);

      // Скрываем кнопку, если загружены все посты
      if (data.data.length < pageSize) {
        setShowLoadMoreButton(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
    }
  };




  const handleKeyUp = (e) => {
    if (e.key === "Backspace") {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
      }
    }
  };

  const [datas, setDatas] = useState({});



  const [fetching, isDataLoadingPupsik, errorPupsik] = useFetchPupsik(async () => {
    const response = await axios.get(
        `https://spbneformal.fun/api/getUser?uid=${window?.Telegram?.WebApp?.initDataUnsafe?.user?.id}`
    );
    console.log(response)
    setDatas(response.data || {});
    return response;
  });

  useEffect(() => {
    fetching();
  }, []);

  const handleButtonClick = async (buttonId, postId) => {
    try {
      if (!buttonId || !postId) {
        console.error("Invalid buttonId or postId");
        return;
      }

      const response = await axios.get(
          `https://spbneformal.fun/api/like?uid=${window?.Telegram?.WebApp?.initDataUnsafe?.user?.id}&postId=${postId}`
      );

      if (response.data.success) {
        const newDatas = { ...datas };
        const likedPosts = newDatas.user?.liked || [];

        // Проверяем, есть ли уже лайк у данного поста
        const existingIndex = likedPosts.findIndex(item => item.id === postId);
        if (existingIndex !== -1) {
          // Удалить лайк, если он уже есть
          likedPosts.splice(existingIndex, 1);
        } else {
          // Добавить лайк, если его нет
          likedPosts.push({ id: postId });
        }

        // Обновить состояние лайков в datas
        newDatas.user.liked = likedPosts;

        // Обновить состояние datas
        setDatas(newDatas);
      } else {
        console.error("Failed to toggle like status");
      }
    } catch (error) {
      console.error("Error during API request:", error);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueData = data.filter((newPost) => {
        return !loadedPostIds.includes(newPost.id);
      });

      setAllData((prevData) => [...prevData, ...uniqueData]);
    }
  }, [data, loadedPostIds]);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setPage(1);
      handleSearch();
    } else {
      // Добавьте код для очистки результатов поиска, если запрос слишком короткий
      setSearchResults([]);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    if (searchResults.data && searchResults.data.length > 4) {
      console.log("Loading...");
    }
  }, [searchResults]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
  };

  // Восстанавливаем данные из sessionStorage при первом рендере
  useEffect(() => {
    const savedData = sessionStorage.getItem('inputPageData');
    if (savedData) {
      const { loadedPostIds: savedPostIds, currentPage: savedPage, searchResults: savedResults } = JSON.parse(savedData);
      setLoadedPostIds(savedPostIds);
      setCurrentPage(savedPage);
      setSearchResults(savedResults);
    }
  }, []);

  // При уходе со страницы Input сохраняем данные в sessionStorage
  useEffect(() => {
    sessionStorage.setItem('inputPageData', JSON.stringify({
      loadedPostIds,
      currentPage,
      searchResults
    }));
  }, [loadedPostIds, currentPage, searchResults])


  return (
      <div className={cl.asd}>
      <div className={cl.container}>
          <div className={cl.block}>
            <Link to="/" className={cl.back}>
              <img src={arrowLeft} alt=""/>
            </Link>
            <Link to="/" className={cl.home}>
              <img src={home} alt=""/>
            </Link>
          </div>

        <div className={cl.fullscreen_input_container}>
          <h1 className={cl.screen_title}>Поиск</h1>
          <div className={cl.img_container}>
            <img src={loop} alt="" className={cl.loop_img}/>
            <input
                type="text"
                placeholder="Поиск мест и событий"
                className={cl.fullscreen_input}
                onFocus={handleInputClick}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className={cl.postsContainer}>
          <div className={cl.card}>
            {searchResults?.data?.map((result, index) => (
                <div key={`${result.id}-${index}`} className={cl.searchResult}>
                  <button
                      onClick={() => handleButtonClick(result.id, result.id)}
                      className={cl.main_like}
                  >
                    <img
                        src={(datas?.user?.liked || []).some(item => item.id === result.id) ? yellow_heart : heart}
                        alt=""
                    />
                    {result.attributes.tag ? (
                        <div className={cl.position}>
                          {result.attributes.tag}
                        </div>
                    ) : (
                        null
                    )}
                  </button>

                  <div className={cl.text__container}>
                    <Link to={`/searchPage/previewPage/${result.id}?categoryId=${result?.attributes?.category?.data?.id}`}>
                      <img
                          src={`https://uploads.spbneformal.fun${result.attributes.images.data[0].attributes.url}`}
                          alt={result.attributes.title}
                          className={cl.searchResultPhoto}
                      />
                    </Link>

                    <p className={cl.searchResultSubtitle}>
                      {result?.attributes?.subsubcategory.data?.attributes?.title
                          ? result?.attributes?.subsubcategory?.data?.attributes?.title
                          : result?.attributes?.subcategory.data?.attributes?.title
                              ? result?.attributes?.subcategory?.data?.attributes?.title
                              : result?.attributes?.category?.data?.attributes?.title
                      }
                    </p>
                    {/* Проверяем наличие данных в result.attributes.tag */}

                    <p className={cl.searchResultTitle}>
                      {result?.attributes?.title}
                    </p>
                  </div>
                </div>
            ))}

          </div>
          {loading && (
              <div className={cl.loadingSpinner}>
                <img className={cl.loader} src={sun1} alt="Loading"/>
              </div>
          )}
        </div>
      </div>
      </div>
  );
};

export default Input;
