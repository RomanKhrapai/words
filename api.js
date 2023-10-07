export async function getTranslation(str, firstLang, secondLang) {
    const wordOrWords = str.split(" ").length > 1 ? "t" : "single";
    const response = await fetch(
        `https://translate.googleapis.com/translate_a/${wordOrWords}?client=gtx&sl=${secondLang}&tl=${firstLang}&q=${str}&dt=bd`,
        {
            method: "GET",
        }
    );
    if (!response.ok) {
        throw new Error(response.status);
    }
    return await response.json();
}
