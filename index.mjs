class SelectorRequest {

    static async doRequest(request, selector) {
        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url.toString()}`);
        }
        const page = await response.text();
        const parsed = (new DOMParser()).parseFromString(page, 'text/html');
        return Array.from(parsed.querySelectorAll(selector));
    }

    static urlFor(urlString) {
        const request = new Request(urlString);
        const url = URL.parse(request.url);

        const comparatorURL = URL.parse(request.url);
        comparatorURL.hash = ""; // remove the hash for comparison
        if (window.location.href === comparatorURL.toString()) {
            return `${window.location.href}${url.hash}`;
        } else {
            return url.toString();
        }
    }

    static fetch(urlString) {
        const request = new Request(urlString);
        const url = URL.parse(request.url);

        const matchedParts = url.hash.match(/^#\(selector=(.*)\)$/);
        const comparatorURL = URL.parse(request.url);
        comparatorURL.hash = ""; // remove the hash for comparison

        let selector = "";
        if (matchedParts) {
            selector = decodeURIComponent(matchedParts[1]);
        } else if (!matchedParts && url.hash) {
            selector = url.hash;
        }

        if (window.location.href === comparatorURL.toString()) {
            // we're local, so we do everything in this page.
            if (!selector) return Array.from(document.body.children).map(el => el.cloneNode(true));
            return Array.from(document.querySelectorAll(selector)).map(el => el.cloneNode(true));
        } else {
            // we're remote, so we need to fetch the page.
            if (!selector) return SelectorRequest.doRequest(request, "body > *");
            return SelectorRequest.doRequest(request, selector);

        }
    }
}

export { SelectorRequest };