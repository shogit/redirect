let hash = window.location.hash;
if (hash && hash.length > 1) {
    const decoded = decodeURIComponent(hash.slice(1));
    if (decoded.startsWith('file://')) {
        const path = decoded.replace(/^file:\/\//, '');
        window.location.href = 'openfinder://' + encodeURIComponent(path);
    } else {
        window.location.href = decoded;
    }
} else {
    let url = new URL(window.location.href);
    let params = url.searchParams;
    if (params.get('to') === null) {
        window.location.href = "https://github.com/shogit/redirect";
    } else {
        window.location.href = decodeURIComponent(params.get('to'));
    }
}
