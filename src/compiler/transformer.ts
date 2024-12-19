import { length } from "../utils/string";
import { CSSRule, HTMLNode } from "./type";

export class Transformer {
    transformHTML(node: HTMLNode): string {
        let result = "";
        
        if (node.type !== "root") {
            result += `new Instance("${this.mapHTMLToRoblox(node.type)}")`;
            
            if (node.attributes && this.hasProperties(node.attributes)) {
                result += this.transformAttributes(node.attributes);
            }
        }
        
        if (node.children && node.children[0] !== undefined) {
            const childrenCode = node.children.map(child => {
                if (typeIs(child, "string")) {
                    return `setText("${child}")`;
                } else {
                    return this.transformHTML(child);
                }
            }).join("\n");
            
            result += `\n${childrenCode}`;
        }
        
        return result;
    }
    
    private hasProperties(obj: Record<string, unknown>): boolean {
        return next(obj)[0] !== undefined;
    }
    
    private mapHTMLToRoblox(tagName: string): string {
        const mapping: Record<string, string> = {
            "div": "Frame",
            "span": "TextLabel",
            "button": "TextButton",
            "input": "TextBox",
        };
        
        return mapping[tagName] || "Frame";
    }
    
    private transformAttributes(attributes: Record<string, string>): string {
        const result: string[] = [];
        
        for (const [key, value] of pairs(attributes)) {
            const robloxProp = this.mapHTMLAttributeToRoblox(key);
            result.push(`.${robloxProp} = "${value}"`);
        }
        
        return result.join("\n");
    }
    
    private mapHTMLAttributeToRoblox(attribute: string): string {
        const mapping: Record<string, string> = {
            "class": "ClassName",
            "id": "Name",
            "style": "Style",
        };
        
        return mapping[attribute] || attribute;
    }
    
    transformCSS(rules: CSSRule[]): string {
        return rules.map(rule => {
            const propertyEntries: string[] = [];
            
            for (const [key, value] of pairs(rule.properties)) {
                const robloxProp = this.mapCSSToRoblox(key);
                propertyEntries.push(`${robloxProp} = "${value}"`);
            }
            
            return `
                ${rule.selector} {
                    ${propertyEntries.join(",\n")}
                }
            `;
        }).join("\n");
    }
    
    private mapCSSToRoblox(cssProperty: string): string {
        const mapping: Record<string, string> = {
            "background-color": "BackgroundColor3",
            "color": "TextColor3",
            "font-size": "TextSize",
            "width": "Size.X",
            "height": "Size.Y",
        };
        
        return mapping[cssProperty] || cssProperty;
    }
}
