import localStorage from "./local-storage/index.js";
import { getTranslation } from "./api.js";
import { validatorText, debounce, findId } from "./help.js";
import { noteify } from "./noteify.js";
import { COUNTRY_TO_FLAG } from "./defaultValues.js";

const refs = {
    btnSelectTabList: document.querySelector("[data-list-open]"),
    btnSelectTabAdd: document.querySelector("[data-add-item]"),
    btnSelectTabStudy: document.querySelector("[data-study-open]"),
    btnLangsOpen: document.querySelector("[data-langs-open]"),
    listWords: document.querySelector(".words-list"),
    btnAddItem: document.querySelector("[data-selected-add]"),
    inputName: document.querySelector("#input-name"),
    inputDescription: document.querySelector("#input-description"),
    studyContent: document.querySelector("[data-study-content]"),
    btnOpenStudyCard: document.querySelector("[data-btn-stydy-card]"),
    btnOpenStudyWrite: document.querySelector("[data-btn-stydy-write]"),
    inputCountCards: document.querySelector("#input-count"),
    btnCloseCards: document.querySelector("[data-content-close]"),
    btnNextCard: document.querySelector("[data-card-turn-right]"),
    btnLastCard: document.querySelector("[data-card-turn-left]"),
    btnBottomNextCard: document.querySelector("[data-card-next]"),
    btnsCardSelect: document.querySelector("[data-card-select]"),
    translationOptionsBox: document.querySelector("[data-translation-options]"),
    firstFlag: document.querySelector("[data-first-flag]"),
    secondFlag: document.querySelector("[data-second-flag]"),
};

const state = {
    firstLang: "UK",
    secondLang: "EN",
    isChangeLang: false,
    wordsList: [
        { id: "1", firstWord: "кіт", secondWord: "cat", checked: false },
        { id: "2", firstWord: "собака", secondWord: "dog", checked: false },
        { id: "3", firstWord: "курка", secondWord: "chiken", checked: false },
        { id: "4", firstWord: "дерево", secondWord: "tree", checked: false },
        { id: "5", firstWord: "лев", secondWord: "lion", checked: false },
        { id: "6", firstWord: "будинок", secondWord: "hous", checked: false },
        { id: "7", firstWord: "шлях", secondWord: "way", checked: false },
        { id: "8", firstWord: "дорога", secondWord: "road", checked: false },
        { id: "9", firstWord: "автомобіль", secondWord: "car", checked: false },
    ],
    cardIndex: 0,
    cardList: [],
};
localStorage.saveState(state);

const reverseWord = (key) => {
    if (state.isChangeLang)
        return key === "firstWord" ? "secondWord" : "firstWord";
    if (!state.isChangeLang)
        return key === "secondWord" ? "secondWord" : "firstWord";
};
const checkedNavBtn = (tabName, ref) => {
    refs.btnLangsOpen.disabled = false;
    if (ref) {
        document
            .querySelectorAll(".nav-btn-active")
            .forEach((elem) => elem.classList.remove("nav-btn-active"));

        ref.classList.add("nav-btn-active");
    }

    document
        .querySelectorAll(".tab-content")
        .forEach((elem) => (elem.style.display = "none"));

    document.getElementById(tabName).style.display = "block";
};

const selectList = (e) => {
    checkedNavBtn("tab-words-list", e.currentTarget);
    renderList();
};

const selectAddWord = (e) => {
    checkedNavBtn("tab-add-item", e.currentTarget);
};

const selectStudy = (e) => {
    checkedNavBtn("tab-study", e.currentTarget);
    const maxNumElem = 3;
    const checkedItem = state.wordsList.filter((item) => item.checked === true);
    let list = [...state.wordsList];

    if (checkedItem.length < maxNumElem) {
        list = list.splice(0, maxNumElem);
        state.cardList = list.sort(() => Math.random() - 0.5);
    } else {
        state.cardList = list
            .filter((item) => item.checked === true)
            .sort(() => Math.random() - 0.5)
            .splice(0, maxNumElem);
    }
};

const createCardList = (maxNumElem) => {
    const checkedItem = state.wordsList.filter((item) => item.checked === true);
    let list = [...state.wordsList];

    if (checkedItem.length < maxNumElem) {
        noteify(
            "обрано мало елементів тому будде використано усі наявні",
            "message"
        );
        list = list.splice(0, maxNumElem);
        state.cardList = list.sort(() => Math.random() - 0.5);
    } else {
        state.cardList = list
            .filter((item) => item.checked === true)
            .sort(() => Math.random() - 0.5)
            .splice(0, maxNumElem);
    }
};

const renderList = () => {
    const isEvery = state.wordsList.every((item) => item.checked === true);
    const itemTitle = `
    <li class="list-item list-title"">
    <div class="list-item-check ${isEvery ? "list-item-check-checked" : ""}
    " data-list-item-id="all"> ${
        state.wordsList.some((item) => item.checked === true) && !isEvery
            ? ' <div class="list-item-check-some"></div>'
            : ""
    }</div>
        <span class="list-item-text">
            визначення
        </span>
        <span class="list-item-text">
            переклад 
        </span>
    </li>`;
    const items = state.wordsList
        .map(
            (item) => `
                <li class="list-item list-item-value" data-list-item-id="${
                    item.id
                }" >
                <div class="list-item-check ${
                    item.checked ? "list-item-check-checked" : ""
                }"></div>
                    <span class="list-item-text">
                        ${item[reverseWord("firstWord")]}
                    </span>
                    <span class="list-item-text">
                        ${item[reverseWord("secondWord")]}
                    </span>
                    <button
                    class="btn-list-item-remove"
                     data-list-item-remove-index=${item.id}
               >
               </button>
                </li>`
        )
        .join("");

    refs.listWords.innerHTML = itemTitle + items;
    refs.listWords
        .querySelectorAll("[data-list-item-remove-index]")
        .forEach((elem) =>
            elem.addEventListener("click", (e) => {
                state.wordsList = state.wordsList.filter(
                    (item) => item.id !== e.target.dataset.listItemRemoveIndex
                );
                localStorage.saveState({ wordsList: state.wordsList });
                renderList();
            })
        );
    refs.listWords.querySelectorAll("[data-list-item-id]").forEach((elem) =>
        elem.addEventListener("click", (e) => {
            if (e.currentTarget.dataset.listItemId === "all") {
                console.log(
                    e.currentTarget.classList.contains(
                        "list-item-check-checked"
                    )
                );
                e.currentTarget.classList.contains("list-item-check-checked");
                state.wordsList.forEach(
                    (item) =>
                        (item.checked = !e.currentTarget.classList.contains(
                            "list-item-check-checked"
                        )
                            ? true
                            : false)
                );
            } else {
                const checkedItem = state.wordsList.find(
                    (item) => item.id === e.currentTarget.dataset.listItemId
                );

                checkedItem.checked = !checkedItem.checked;
            }

            localStorage.saveState({ wordsList: state.wordsList });
            renderList();
        })
    );
};

const showStudyCard = () => {
    checkedNavBtn("tab-cards");
    refs.btnLangsOpen.disabled = true;

    state.cardIndex = 0;
    refs.btnNextCard.disabled = false;
    refs.btnBottomNextCard.disabled = false;
    refs.btnLastCard.disabled = true;
    createCardList(getCountCards());

    refs.studyContent.classList.remove("cards-slider-big");
    refs.studyContent.innerHTML = state.cardList
        .map(
            (elem, index) =>
                `
                <div class="card-slider ${
                    index > 0 ? "card-slider-right" : ""
                }" data-index='${index}'>
    <label class="card-label">
            <input class='card-input' type="checkbox" />
            <div class="card">
                <div class="front">${elem[reverseWord("firstWord")]}</div>
                <div class="back">${elem[reverseWord("secondWord")]}</div>
            </div>
        </label></div>
        `
        )
        .join("");

    renderBtnsCardSelect(refs.btnsCardSelect, state.cardList, state.cardIndex);
};

const renderBtnsCardSelect = (ref, cardList, cardIndex) => {
    ref.innerHTML = cardList
        .map(
            (elem, index) => `
        <button
             class="btn-select-card ${
                 index === cardIndex ? "btn-select-card-active" : ""
             }"
              data-card-index=${index}
        >
        </button>`
        )
        .join("");
};

const showStudyWrite = () => {
    const countCards = getCountCards();
    if (!countCards) return;

    checkedNavBtn("tab-cards");
    refs.btnLangsOpen.disabled = true;

    state.cardIndex = 0;
    refs.btnNextCard.disabled = false;
    refs.btnBottomNextCard.disabled = false;
    refs.btnLastCard.disabled = true;

    refs.studyContent.classList.add("cards-slider-big");
    refs.studyContent.innerHTML = state.cardList
        .map(
            (elem, index) => `
            <div class="card-slider ${
                index > 0 ? "card-slider-right" : ""
            }" data-index='${index}'>
    <form class="write-form">
        <label class="write-label">
        <div class="card">
        <div class="front" data-write-value="${index}">${
                elem[reverseWord("firstWord")]
            }</div>
    </div> </label>
    <div class='write-input-box'>
            <input class='write-input' type="text"  placeholder="Напишіть відповідь" data-write-input="${index}"/>
            <svg class="write-input-icon icon-quill" width="25" height="25" >
            <use xlink:href="#icon-quill"></use>
            <symbol id="icon-quill" viewBox="0 0 32 32"><path d="M0 32c4-12 14.469-32 32-32-8.219 6.594-12 22-18 22s-6 0-6 0l-6 10h-2z"></path></symbol></svg>
           </div>
       
        <input class="write-btn" type="submit" value="Перевірити" data-write-btn-submit="${index}">
        <div class="write-result" data-write-checked-result="${index}">
        </div>
        </form>
        </div>
    `
        )
        .join("");

    renderBtnsCardSelect(refs.btnsCardSelect, state.cardList, state.cardIndex);

    refs.studyContent
        .querySelectorAll("[data-write-btn-submit]")
        .forEach((elem) => {
            elem.addEventListener("click", checkedResult);
        });
};

const checkedResult = (e) => {
    e.preventDefault();
    const index = +e.target.dataset.writeBtnSubmit;

    const value = validatorText(
        refs.studyContent
            .querySelector(`[data-write-input="${index}"]`)
            .value.toLowerCase()
    );

    const result = value === state.cardList[index][reverseWord("secondWord")];

    refs.studyContent.querySelector(`[data-write-value="${index}"]`).innerHTML =
        state.cardList[index][reverseWord("secondWord")];

    refs.studyContent
        .querySelector(`[data-write-checked-result="${index}"]`)
        .classList.add(result ? "write-result-true" : "write-result-false");

    refs.btnsCardSelect
        .querySelector(`[data-card-index="${index}"]`)
        .classList.add(
            result ? "btn-select-card-true" : "btn-select-card-false"
        );
};

const getCountCards = () => {
    const num = +refs.inputCountCards.value;

    if (!num || num > state.wordsList.length) {
        noteify(
            "недостатньо карток, будуть використані всі наявні!",
            "message"
        );
        refs.inputCountCards.value =
            state.wordsList.length > 10 ? 10 : state.wordsList.length;
        return state.wordsList.length;
    }

    return num;
};

const selectNextCard = (e) => {
    if (state.cardIndex < state.cardList.length - 1) {
        state.cardIndex += 1;
        refs.btnLastCard.disabled = false;
        refs.studyContent
            .querySelector(`[data-index="${state.cardIndex}"]`)
            .classList.remove("card-slider-right");
        refs.studyContent
            .querySelector(`[data-index="${state.cardIndex - 1}"]`)
            .classList.add("card-slider-left");
    } else {
        refs.btnNextCard.disabled = true;
        refs.btnBottomNextCard.disabled = true;
    }

    chooseCurentCard();
};

const selectLastCard = (e) => {
    if (state.cardIndex > 0) {
        state.cardIndex -= 1;
        refs.btnNextCard.disabled = false;
        refs.btnBottomNextCard.disabled = false;
        refs.studyContent
            .querySelector(`[data-index="${state.cardIndex}"]`)
            .classList.remove("card-slider-left");
        refs.studyContent
            .querySelector(`[data-index="${state.cardIndex + 1}"]`)
            .classList.add("card-slider-right");
    } else {
        e.target.disabled = true;
    }

    chooseCurentCard();
};
const chooseCurentCard = (e) => {
    const index = +(e?.target.dataset.cardIndex ?? state.cardIndex);

    if (!Number.isFinite(index)) return;

    state.cardIndex = index;

    refs.studyContent.querySelectorAll("[data-index]").forEach((elem) => {
        if (elem.dataset.index < index) {
            elem.classList.add("card-slider-left");
            elem.classList.remove("card-slider-right");
        } else if (elem.dataset.index > index) {
            elem.classList.remove("card-slider-left");
            elem.classList.add("card-slider-right");
        } else {
            elem.classList.remove("card-slider-left");
            elem.classList.remove("card-slider-right");
            refs.btnsCardSelect
                .querySelector(".btn-select-card-active")
                ?.classList.remove("btn-select-card-active");
            refs.btnsCardSelect
                .querySelector(`[data-card-index="${index}"]`)
                .classList.add("btn-select-card-active");
        }
    });

    if (index === 0) {
        refs.btnNextCard.disabled = false;
        refs.btnBottomNextCard.disabled = false;
        refs.btnLastCard.disabled = true;
    } else if (index === state.cardList.length - 1) {
        refs.btnNextCard.disabled = true;
        refs.btnBottomNextCard.disabled = true;
        refs.btnLastCard.disabled = false;
    } else {
        refs.btnNextCard.disabled = false;
        refs.btnBottomNextCard.disabled = false;
        refs.btnLastCard.disabled = false;
    }
};

const addItem = () => {
    const firstWord = validatorText(refs.inputName.value);
    const secondWord = validatorText(refs.inputDescription.value);

    if (!firstWord) {
        return noteify("недопустиме значення визначення", "error");
    }
    if (!secondWord) {
        return noteify("недопустиме значення опису", "error");
    }

    state.wordsList.push({
        id: findId(state.wordsList.map((item) => item.id)),
        firstWord,
        secondWord,
        checked: false,
    });

    refs.inputName.value = "";
    refs.inputDescription.value = "";
    refs.translationOptionsBox.innerHTML = "";

    noteify("Елумент успішно додано", "success");

    localStorage.saveState({ wordsList: state.wordsList });
    renderList();
};

const searchTranslation = () => {
    const searchRequest = validatorText(refs.inputName.value);

    if (searchRequest === "") return;

    if (!searchRequest) {
        return noteify(
            "Введено не конкретні дані для автоматичного перекладу",
            "error"
        );
    }

    getTranslation(searchRequest, state.firstLang, state.secondLang)
        .then((data) => {
            if (data[0]) {
                renderTranslationOptions(data[0]);
                return;
            }
            if (!data[1]) {
                return;
            }
            renderTranslationOptions(data[1]);
        })

        .catch((error) => {
            console.log(error);
            noteify("При автоматичному перекладі сталася помилка!");
        });
};

const renderTranslationOptions = (translationData) => {
    if (!Array.isArray(translationData)) {
        refs.translationOptionsBox.innerHTML = `<p class='translation-item'> ${translationData}</p>`;
        return;
    }

    refs.translationOptionsBox.innerHTML = translationData
        .map(
            (section) => `
    <h3 class="translation-title" >${section[0]}</h3>
    <ul class="translation-list">${renderTranslationItem(section[1])}</ul>
    `
        )
        .join("");
};

const renderTranslationItem = (items) =>
    items
        .map(
            (item) => `
    <li class='translation-item'> ${item}</li>`
        )
        .join("");

const addElemToTranslationInput = (e) => {
    if (e.target.classList.contains("translation-item"))
        refs.inputDescription.value = e.target.innerText;
};

const changeLang = () => {
    state.isChangeLang = !state.isChangeLang;

    const firstImg = !state.isChangeLang
        ? COUNTRY_TO_FLAG[state.firstLang].img
        : COUNTRY_TO_FLAG[state.secondLang].img;
    const firstAlt = !state.isChangeLang
        ? COUNTRY_TO_FLAG[state.firstLang].name
        : COUNTRY_TO_FLAG[state.secondLang].name;
    const secondImg = !state.isChangeLang
        ? COUNTRY_TO_FLAG[state.secondLang].img
        : COUNTRY_TO_FLAG[state.firstLang].img;
    const secondAlt = !state.isChangeLang
        ? COUNTRY_TO_FLAG[state.secondLang].name
        : COUNTRY_TO_FLAG[state.firstLang].name;

    refs.btnLangsOpen.innerHTML = `
        <img
  src="${firstImg}"
  alt="${firstAlt}" height='30' width='30'/>  
  <svg  height='25' width='25'><use xlink:href="#icon-spinner9"></use><symbol id="icon-spinner9" viewBox="0 0 32 32">
  <path d="M16 0c-8.711 0-15.796 6.961-15.995 15.624 0.185-7.558 5.932-13.624 12.995-13.624 7.18 0 13 6.268 13 14 0 1.657 1.343 3 3 3s3-1.343 3-3c0-8.837-7.163-16-16-16zM16 32c8.711 0 15.796-6.961 15.995-15.624-0.185 7.558-5.932 13.624-12.995 13.624-7.18 0-13-6.268-13-14 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 8.837 7.163 16 16 16z"></path>
  </symbol></svg>
  
  <img
    src="${secondImg}"
    alt="${secondAlt}" height='30' width='30'/>`;

    refs.firstFlag.src = firstImg;
    refs.firstFlag.alt = firstAlt;
    refs.secondFlag.src = secondImg;
    refs.secondFlag.alt = secondAlt;

    refs.inputName.value = "";
    refs.inputDescription.value = "";
    refs.translationOptionsBox.innerHTML = "";
    renderList();
};

refs.btnSelectTabAdd.addEventListener("click", selectAddWord);
refs.btnSelectTabList.addEventListener("click", selectList);
refs.btnSelectTabStudy.addEventListener("click", selectStudy);
refs.btnLangsOpen.addEventListener("click", changeLang);
refs.btnAddItem.addEventListener("click", addItem);
refs.btnOpenStudyCard.addEventListener("click", showStudyCard);
refs.btnOpenStudyWrite.addEventListener("click", showStudyWrite);
refs.btnCloseCards.addEventListener("click", () => checkedNavBtn("tab-study"));
refs.btnNextCard.addEventListener("click", selectNextCard);
refs.btnLastCard.addEventListener("click", selectLastCard);
refs.btnBottomNextCard.addEventListener("click", selectNextCard);
refs.btnsCardSelect.addEventListener("click", chooseCurentCard);
refs.inputName.addEventListener("input", debounce(searchTranslation, 500));
refs.translationOptionsBox.addEventListener("click", addElemToTranslationInput);

Object.assign(state, localStorage.getState());

changeLang();
checkedNavBtn("tab-words-list");
