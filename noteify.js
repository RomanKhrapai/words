export const noteify = (str, type = "success") => {
    const ref = document.querySelector("#noteify");
    ref.innerHTML = `
   ${str}
    `;
    const time = 2500;
    switch (type) {
        case "error":
            ref.classList.add("noteify-error");
            window.setTimeout(() => {
                ref.classList.remove("noteify-error");
            }, time);
            break;
        case "message":
            ref.classList.add("noteify-message");
            window.setTimeout(() => {
                ref.classList.remove("noteify-message");
            }, time);
            break;
        case "success":
            ref.classList.add("noteify-success");
            window.setTimeout(() => {
                ref.classList.remove("noteify-success");
            }, time);
            break;

        default:
            break;
    }
    ref.classList.add("noteify-active");
    window.setTimeout(() => {
        ref.classList.remove("noteify-active");
    }, time);
};
