Object.defineProperty( window.URL.prototype, 'selector', {
    get: function() {
        const matchedParts = this.hash.match(/^#\(selector=(.*)\)$/);
        if ( !matchedParts ) {
            return null;
        }
        return matchedParts[1];
    },
    set: function( value ) {
        this.hash = `#(selector=${value})`;
    }
});

class SelectorRequest {
    static async fetch( urlString ) {
        console.log("", "SelectorRequest.fetch", urlString);
        const request = new Request( urlString );
        const url = URL.parse( request.url );
        if ( !url.selector ) {
            throw new Error("Selector not specified in the URL.");
        }

        const comparatorURL = URL.parse( request.url );
        comparatorURL.hash = "";

        if ( window.location.href === comparatorURL.toString() ) {
            // no need to go to the network if its the same thing.
            return Array.from( document.querySelectorAll(url.selector) ).map( el => el.cloneNode( true ) );
        } else {
            const response = await fetch( request );
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url.toString()}`);
            }
            const page = await response.text();
            const parsed = (new DOMParser()).parseFromString(page, 'text/html');
            return Array.from( parsed.querySelectorAll(url.selector) );
        }
    }
}

export { SelectorRequest };

