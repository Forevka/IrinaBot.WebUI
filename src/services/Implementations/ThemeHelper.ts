class ThemeHelper {

    public preloadTheme(href: string) {
        let link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);

        return new Promise((resolve, reject) => {
            link.onload = e => {
                // @ts-ignore
                const sheet = e.target.sheet;
                sheet.disabled = true;
                resolve(sheet);
            };
            link.onerror = reject;
        });
    }

    public selectTheme(themes, name) {
        if (name && !themes[name]) {
            throw new Error(`"${name}" has not been defined as a theme.`);
        }
        Object.keys(themes).forEach(n => themes[n].disabled = (n !== name));
    }

    private themes = {};

    public add(name: string, href: string) {
        return this.preloadTheme(href)
            .then(s => this.themes[name] = s)
    }

    set theme(name) {
        this.selectTheme(this.themes, name)
    }

    get theme() {
        return Object.keys(this.themes)
            .find(n => !this.themes[n].disabled)
    }
}

export default new ThemeHelper();