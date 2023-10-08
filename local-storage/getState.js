export const getState = () => {
    const firstLang = localStorage.getItem("firstLang") ?? null;
    const secondLang = localStorage.getItem("secondLang") ?? null;

    const isChangeLang =
        JSON.parse(localStorage.getItem("isChangeLang")) ?? true;

    const wordsList = JSON.parse(localStorage.getItem("wordsList")) ?? [];

    return { secondLang, firstLang, isChangeLang, wordsList };
};
