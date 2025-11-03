const useSvgParser = async (uri: string) => {
    try {
        const response = await fetch(uri);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки SVG: ${response.status} ${response.statusText}`);
        }

        const svg = await response.text();

        const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;

        const svgParamsRegex = /<svg[^>]*\s(width|height|viewBox|fill)="([^"]*)"/g;

        const paths: { d: string; [key: string]: string }[] = [];
        let pathMatch;
        while ((pathMatch = pathRegex.exec(svg)) !== null) {
            const pathAttributes = {};
            const attributeRegex = /(\w+)="([^"]*)"/g;
            let attrMatch;
            while ((attrMatch = attributeRegex.exec(pathMatch[0])) !== null) {
                pathAttributes[attrMatch[1]] = attrMatch[2];
            }
            paths.push(pathAttributes);
        }

        const svgParams: { [key: string]: string } = {};
        let match;
        while ((match = svgParamsRegex.exec(svg)) !== null) {
            svgParams[match[1]] = match[2];
        }

        return { paths, svgParams };
    } catch (error) {
        console.error('Ошибка загрузки SVG:', error);
        return null;
    }
};

export default useSvgParser;
