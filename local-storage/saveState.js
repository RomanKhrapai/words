export const saveState = (state) => {
    const { firstLang, secondLang, isChangeLang = false, wordsList } = state;

    if (firstLang) {
        localStorage.setItem("firstLang", firstLang);
    }
    if (secondLang) {
        localStorage.setItem("secondLang", secondLang);
    }

    localStorage.setItem("isChangeLang", isChangeLang);

    if (wordsList) {
        localStorage.setItem("wordsList", JSON.stringify(wordsList));
    }
};
