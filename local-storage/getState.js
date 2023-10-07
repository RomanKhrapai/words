export const getState = () => {
    const firstLang = localStorage.getItem("firstLang") ?? null;
    const secondLang = localStorage.getItem("secondLang") ?? null;

    const isRandomWord =
        JSON.parse(localStorage.getItem("isRandomWord")) ?? true;

    const wordsList = JSON.parse(localStorage.getItem("wordsList")) ?? [];

    return { secondLang, firstLang, isRandomWord, wordsList };
};
