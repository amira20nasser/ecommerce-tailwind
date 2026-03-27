

function setCookie(name, value, durationMs) {
    const expires = new Date(Date.now() + durationMs).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=; path=/;`;
}
export { setCookie, getCookie, deleteCookie }