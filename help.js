export const validatorText = (str) => {
    const newStr = str.replace(/ {1,}/g, " ");
    const arr = newStr.replace(/[\,\!\?\;\:@#$%^&*\(\)\.]/g, "").split("");

    const isMisstake =
        arr.some((element) => Number.isFinite(+element) && element !== " ") ||
        arr.length !== newStr.length;

    return isMisstake ? null : newStr.trim();
};

export const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};

export const findId = (listId) => Math.max(...listId) + 1;
