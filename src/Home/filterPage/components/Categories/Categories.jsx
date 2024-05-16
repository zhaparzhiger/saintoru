import React, { useEffect, useRef, useState } from 'react';
import cl from '../SelectBlock/SelectBlock.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import axios from 'axios';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import {useDispatch, useSelector} from "react-redux";
import {
    resetCategoryTitle,
    setActiveCategory, setActiveCategoryInfoPage,
    setCategoryTitle,
    setCategoryTitled, setCurrentlySelectedCategory,
    setSelectedSubcategory, setSelectedSubsubcategory, setSelectedSubsubcategoryButton
} from "../../../../actions.js";
import Places from "../Places/Places.jsx";
import MyLine from "../UI/MyLine/MyLine.jsx";
import MyBigButton from "../UI/MyBigButton/MyBigButton.jsx";
import sun from "../../imgs/Header/sun.svg";
import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import SelectBlock from "../SelectBlock/SelectBlock.jsx";
import MySelector from "../UI/MySelector/MySelector.jsx";

const Categories = ({ handleSortState,activeCategory, onCategoryClick, handleFilterPageClose }) => {
    const [selectedSubcategoryd, setSelectedSubcategoryd] = useState(activeCategory); // Изменено на selectedSubcategoryd

    const [selectedButton, setSelectedButton] = useState(activeCategory);
    const [categoryTitles, setCategoryTitles] = useState({});
    const pathParts = location.pathname.split('/');
    const encodedCategory = pathParts[pathParts.length - 1];
    const initialCategoryId = categoryTitles[encodedCategory] || encodedCategory;
    const [activeCategoryId, setActiveCategoryId] = useState(activeCategory || initialCategoryId);
    const [data, setData] = useState({});
    const [fetching, isDataLoading, dataError] = useFetch(async () => {
        const response = await axios.get(
            'https://spbneformal.fun/api/categories?populate=image,posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory'
        );
        setData(response.data || {});
        return response;
    });
    const [loading, setLoading] = useState(true);
    const activeCategoryInfoPage = useSelector(state => state?.title?.activeCategoryInfoPage);


    useEffect(() => {
        setLoading(false);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(activeCategory);
    useEffect(() => {
        if (activeCategory) {
            setSelectedCategory(activeCategory);
        }
    }, [activeCategory]);
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, [buttonRef]);

    useEffect(() => {
        fetching();
    }, []);

    const dispatch = useDispatch();

    useEffect(() => {
        if (data.data && initialCategoryId) { // Используйте initialCategoryId
            const defaultActiveCategoryIndex = data.data.findIndex(
                (button) => button.id === initialCategoryId
            );

            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                setActiveCategoryId(data?.data?.[defaultActiveCategoryIndex]?.id);
                if (onCategoryClick) {
                    onCategoryClick({
                        category: data?.data?.[defaultActiveCategoryIndex],
                        categoryId: data?.data?.[defaultActiveCategoryIndex]?.id,
                    });
                }
            }
        }

        setSelectedButton(null);
    }, [data.data, onCategoryClick, initialCategoryId]);

    useEffect(() => {
        clearLocalStorage()
        if (!activeCategory && data.data && data.data.length > 0) {
            // Если activeCategory не установлено и у нас есть данные категорий,
            // установите activeCategory в идентификатор первой категории
            const defaultActiveCategory = data.data[0].id;
            setActiveCategoryId(defaultActiveCategory);
            dispatch(setActiveCategory(defaultActiveCategory));
            setSelectedButton(0); // Устанавливаем первую категорию активной
        }
    }, [data.data, dispatch, activeCategory]);
    const [filterClosed, setFilterClosed] = useState(false);

    const handleCloseFilter = () => {
        setFilterClosed(true);
    };
    const handleResetSelection = () => {
        setActiveButtonIndex(null)
        setSelectedButton(null)
        setActiveCategoryId(null)
        setSelectedSubcategoryd(null) // Изменено на selectedSubcategoryd
        dispatch(setActiveCategory(null))
        dispatch(setSelectedSubsubcategory(null))
        dispatch(setSelectedSubsubcategoryButton(null))
        localStorage.removeItem('selectedCategory')
        localStorage.removeItem('selectedSubcategory')
    };
    const clearLocalStorage = () => {
        localStorage.removeItem('selectedCategoryId');
        localStorage.removeItem('selectedSubcategoryd'); // Изменено на selectedSubcategoryd
    };
    const handleButtonClick = (index, categoryId) => {
        dispatch(setActiveCategoryInfoPage(categoryId)); // установка активной категории в InfoPage
        dispatch(setSelectedSubcategory(null))
        dispatch(setSelectedSubsubcategory(null))
        dispatch(setActiveCategory(categoryId));
        setSelectedButton(null);
        setActiveCategoryId(null);
        dispatch(setCurrentlySelectedCategory(categoryId));

        dispatch(setActiveCategory(null));
        if (selectedButton !== index) {
            setSelectedButton(index);

        }


        const clickedCategoryId = data?.data?.[index]?.id;
        setActiveCategoryId(clickedCategoryId);

        if (onCategoryClick) {
            onCategoryClick({
                category: data?.data?.[index],
                categoryId: clickedCategoryId,
            });
        }

        localStorage.setItem('selectedCategory', categoryId)

    };


    useEffect(() => {
        if (data.data && initialCategoryId) { // Используйте initialCategoryId
            const defaultActiveCategoryIndex = data.data.findIndex(
                (button) => button.id === initialCategoryId
            );



            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                setActiveCategoryId(data?.data?.[defaultActiveCategoryIndex]?.id);

                if (onCategoryClick) {
                    onCategoryClick({
                        category: data?.data?.[defaultActiveCategoryIndex],
                        categoryId: data?.data?.[defaultActiveCategoryIndex]?.id,
                    });


                }
            }
        }

        setSelectedButton(null);
    }, [data.data, onCategoryClick, initialCategoryId]);



    useEffect(() => {
        if (activeCategory !== null) {
            setSelectedCategory(activeCategory);
        }

    }, [activeCategory])

    useEffect(() => {
        setSelectedButton(null);

    }, [activeCategory])


    const [sup,setSup] = useState(false);
    useEffect(() => {
        if (data.data && activeCategory) {
            const defaultActiveCategoryIndex = data.data.findIndex(
                (button) => button.id === activeCategory
            );

            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                setActiveCategoryId(data?.data?.[defaultActiveCategoryIndex]?.id);
            }

        }

    }, [data.data, activeCategory]);

    const currentlySelectedCategory = useSelector(state => state.title.currentlySelectedCategory);
    const negr = useSelector(state => state.title.negr);

    const [activeButtonIndex, setActiveButtonIndex] = useState(null);

    const handleClick = (index) => {
        setActiveButtonIndex(index === activeButtonIndex ? null : index);
    };

    useEffect(() => {
        const selectedCategory = localStorage.getItem('selectedCategory')
        if (selectedCategory) {
            setSelectedButton(activeCategoryId - 1)
        }
    }, [selectedButton]);



    console.log(currentlySelectedCategory + "suchka")
    return (
        <div className={cl.nt}>
            <Header handleFilterPageClose={handleFilterPageClose}  resetUgu={handleResetSelection}/>
            <div className={cl.selectBlock}>
                <MySelector
                    onClick={() => {handleClick(0); handleSortState()}}
                    isActive={activeButtonIndex === 0}
                >
                    По популярности
                </MySelector>
            </div>
            <MyLine/>

            {loading && (
                <div className={cl.loadingSpinner}>
                    <img className={cl.loader} src={sun} alt="Loading" />
                </div>
            )}
            <div className={cl.button__select}>
                <div className={cl.button__select__row}>
                    {data?.data?.map((button, index) => (
                        <MySelectedButton
                            key={index}
                            isRed={(selectedButton === index) || (activeCategory === index && index === 0)}
                            onClick={() => {
                                dispatch(setCategoryTitled(button.attributes?.title))

                                handleButtonClick(index,button.id);
                            }}
                            ref={index === 0 ? buttonRef : null}
                        >
                            <img
                                className={cl.button__image}
                                src={`https://uploads.spbneformal.fun${button?.attributes?.image?.data?.attributes?.url}`}
                                alt={`Изображение ${index}`}
                            />
                            {button?.attributes?.title}
                        </MySelectedButton>
                    ))}
                </div>
            </div>
            <MyLine />
            {selectedButton !== null && (
                <>
                    <Places activeCategory={activeCategoryId} selectedSubcategory={selectedSubcategoryd} />
                </>
            )}
            {isDataLoading ? (
                <div style={{ height: '40px' }} className={cl.loadingSpinner}>
                    <img style={{ width: 20 }} className={cl.loader} src={sun} alt="Loading" />
                </div>
            ) : (
                <div className={cl.cont}>
                    <MyBigButton
                        onSelectCategory={handleCategorySelect}
                        handleFilterPageClose={handleFilterPageClose}
                        categoryId={activeCategoryId}
                        seks={negr}
                        onCloseFilter={handleCloseFilter}
                    >
                        Показать результаты
                    </MyBigButton>
                </div>
            )}
        </div>
    );

};

export default Categories;
