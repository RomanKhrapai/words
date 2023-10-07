export const saveState = (state) => {
    const { firstLang, secondLang, isRandomWord = false, wordsList } = state;

    if (firstLang) {
        localStorage.setItem("firstLang", firstLang);
    }
    if (secondLang) {
        localStorage.setItem("secondLang", secondLang);
    }

    localStorage.setItem("isRandomWord", isRandomWord);

    if (wordsList) {
        localStorage.setItem("wordsList", JSON.stringify(wordsList));
    }
};
