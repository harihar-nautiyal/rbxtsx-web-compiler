import { CSSParser } from "./compiler/cssParser";
import { HTMLParser } from "./compiler/htmlParser";
import { Transformer } from "./compiler/transformer";
import { arrayLength, length, trim } from "./utils/string";

export class Compiler {
    private transformer: Transformer;

    constructor() {
        this.transformer = new Transformer();
    }

    compile(html: string, css: string): Instance {
        // Parse HTML and CSS
        const htmlParser = new HTMLParser(html);
        const cssParser = new CSSParser(css);

        const htmlAst = htmlParser.parse();
        const cssRules = cssParser.parse();

        // Transform to Roblox code
        const robloxCode = this.transformer.transformHTML(htmlAst);
        const robloxStyles = this.transformer.transformCSS(cssRules);

        // Create root container
        const container = new Instance("Frame");
        container.Name = "CompiledUI";
        (container as Frame).BackgroundTransparency = 1;
        (container as Frame).Size = new UDim2(1, 0, 1, 0);
        
        // Parse and apply the transformed code
        this.parseAndApplyCode(robloxCode, container);
        this.parseAndApplyStyles(robloxStyles, container);

        return container;
    }

    private parseAndApplyCode(code: string, parent: Instance): void {
        // Split code into lines and process each instruction
        const lines = code.split("\n");
        let currentParent = parent;

        for (const line of lines) {
            const trimmedLine = trim(line);
            if (trimmedLine === "") continue;

            if (this.stringIncludes(trimmedLine, "new Instance")) {
                const instanceMatch = this.matchString(trimmedLine, "new Instance\$\"(\\w+)\"\$");
                if (instanceMatch && instanceMatch[1]) {
                    const instance = new Instance(instanceMatch[1] as keyof CreatableInstances);
                    instance.Parent = currentParent;
                    currentParent = instance;

                    // Check for Name
                    const classMatch = this.matchString(trimmedLine, "\\.ClassName = \"(.+)\"");
                    if (classMatch && classMatch[1]) {
                        instance.Name = classMatch[1];
                    }
                }
            } else if (this.stringIncludes(trimmedLine, "setText")) {
                const textMatch = this.matchString(trimmedLine, "setText\$\"(.+)\"\$");
                if (textMatch && textMatch[1]) {
                    if (this.isTextInstance(currentParent)) {
                        (currentParent as TextLabel | TextButton | TextBox).Text = textMatch[1];
                    }
                }
            }
        }
    }

    private parseAndApplyStyles(styles: string, root: Instance): void {
        const rules = styles.split("}");
        
        for (const rule of rules) {
            const trimmedRule = trim(rule);
            if (trimmedRule === "") continue;

            const parts = trimmedRule.split("{");
            if (arrayLength(parts) < 2) continue;

            const selector = trim(parts[0]);
            const className = selector.sub(2); // Remove the leading dot

            const elements = this.findElementsByClassName(root, className);
            
            for (const element of elements) {
                const propertyLines = parts[1].split(",");
                for (const prop of propertyLines) {
                    const [property, value] = prop.split("=").map((s: string) => trim(s));
                    if (property && value) {
                        const cleanValue = value.sub(2, -2); // Remove quotes
                        
                        this.applyProperty(element, property, cleanValue);
                    }
                }
            }
        }
    }

    private applyProperty(element: Instance, property: string, value: string): void {
        switch (property) {
            case "BackgroundColor3":
                if (element.IsA("GuiObject")) {
                    element.BackgroundColor3 = Color3.fromHex(value);
                }
                break;
            case "TextColor3":
                if (this.isTextInstance(element)) {
                    (element as TextLabel | TextButton | TextBox).TextColor3 = Color3.fromHex(value);
                }
                break;
            case "Size.X":
                if (element.IsA("GuiObject")) {
                    element.Size = new UDim2(0, tonumber(value) || 0, element.Size.Y.Scale, element.Size.Y.Offset);
                }
                break;
            case "Size.Y":
                if (element.IsA("GuiObject")) {
                    element.Size = new UDim2(element.Size.X.Scale, element.Size.X.Offset, 0, tonumber(value) || 0);
                }
                break;
            case "TextSize":
                if (this.isTextInstance(element)) {
                    (element as TextLabel | TextButton | TextBox).TextSize = tonumber(value) || 14;
                }
                break;
        }
    }

    private isTextInstance(instance: Instance): boolean {
        return instance.IsA("TextLabel") || instance.IsA("TextButton") || instance.IsA("TextBox");
    }

    private findElementsByClassName(root: Instance, className: string): Instance[] {
        const results: Instance[] = [];
        
        if (root.Name === className) {
            results.push(root);
        }

        for (const child of root.GetChildren()) {
            if (child.Name === className) {
                results.push(child);
            }
            results.push(...this.findElementsByClassName(child, className));
        }

        return results;
    }

    private stringIncludes(str: string, searchStr: string): boolean {
        return str.find(searchStr)[0] !== undefined;
    }

    private matchString(str: string, pattern: string): string[] | null {
        const result = str.match(pattern);
        if (!result) return null;
        
        const matches: string[] = [];
        for (let i = 0; i < result.size(); i++) {
            const match = result[i];
            matches.push(match !== undefined ? tostring(match) : '');
        }
        return matches;
    }
}
