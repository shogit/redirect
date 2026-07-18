let hash = window.location.hash;
if (hash && hash.length > 1) {
    window.location.href = decodeURIComponent(hash.slice(1));
} else {
    let url = new URL(window.location.href);
    let params = url.searchParams;
    if (params.get('to') === null) {
        window.location.href = "https://github.com/shogit/redirect";
    } else {
        window.location.href = decodeURIComponent(params.get('to'));
    }
}
