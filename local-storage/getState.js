export const getState = () => {
    const firstLang = localStorage.getItem("firstLang") ?? "UK";
    const secondLang = localStorage.getItem("secondLang") ?? "EN";

    const isChangeLang =
        JSON.parse(localStorage.getItem("isChangeLang")) ?? true;

    const wordsList = JSON.parse(localStorage.getItem("wordsList")) ?? [];

    return { secondLang, firstLang, isChangeLang, wordsList };
};
