class SelectorRequest {
    static async fetch( urlString ) {
        const request = new Request( urlString );
        const url = URL.parse( request.url );
        
        const matchedParts = url.hash.match(/^#\(selector=(.*)\)$/);
        const selector = decodeURIComponent(matchedParts[1]);
        if ( !selector ) {
            throw new Error("Selector not specified in the URL.");
        }

        const comparatorURL = URL.parse( request.url );
        comparatorURL.hash = "";

        if ( window.location.href === comparatorURL.toString() ) {
            // no need to go to the network if its the same thing.
            return Array.from( document.querySelectorAll(selector) ).map( el => el.cloneNode( true ) );
        } else {
            const response = await fetch( request );
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url.toString()}`);
            }
            const page = await response.text();
            const parsed = (new DOMParser()).parseFromString(page, 'text/html');
            return Array.from( parsed.querySelectorAll(selector) );
        }
    }
}

export { SelectorRequest };

