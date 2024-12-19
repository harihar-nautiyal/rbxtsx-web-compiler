import { length, sta } from "../utils/string";
import { HTMLNode } from "./type";

export class HTMLParser {
    private pos = 0;
    private input: string;

    constructor(input: string) {
        this.input = input;
    }

    parse(): HTMLNode {
        const root: HTMLNode = {
            type: "root",
            attributes: {},
            children: []
        };

        while (this.pos < length(this.input)) {
            
            const char = sta(this.input)[this.pos];
            
            if (char === "<") {
                const node = this.parseTag();
                if (node) {
                    root.children.push(node);
                }
            } else {
                const text = this.parseText();
                if (text) {
                    root.children.push(text);
                }
            }
        }

        return root;
    }

    private parseTag(): HTMLNode | null {
        // Skip opening bracket
        this.pos++;
        
        let tagName = "";
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== " " && sta(this.input)[this.pos] !== ">") {
            tagName += sta(this.input)[this.pos];
            this.pos++;
        }

        const node: HTMLNode = {
            type: tagName,
            attributes: {},
            children: []
        };

        // Parse attributes
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== ">") {
            this.parseAttribute(node);
        }

        // Skip closing bracket
        this.pos++;

        return node;
    }

    private parseAttribute(node: HTMLNode): void {
        // Skip whitespace
        while (this.pos < length(this.input) && sta(this.input)[this.pos] === " ") {
            this.pos++;
        }

        let attrName = "";
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== "=" && sta(this.input)[this.pos] !== " " && sta(this.input)[this.pos] !== ">") {
            attrName += sta(this.input)[this.pos];
            this.pos++;
        }

        if (sta(this.input)[this.pos] === "=") {
            this.pos++; // Skip equals
            if (sta(this.input)[this.pos] === "\"") {
                this.pos++; // Skip opening quote
                let value = "";
                while (this.pos < length(this.input) && sta(this.input)[this.pos] !== "\"") {
                    value += sta(this.input)[this.pos];
                    this.pos++;
                }
                this.pos++; // Skip closing quote
                node.attributes[attrName] = value;
            }
        }
    }

    private parseText(): string {
        let text = "";
        let start = 0;
        let _end = 0;
    
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== "<") {
            text += sta(this.input)[this.pos];
            this.pos++;
            _end++;
        }
    
        while (start < _end && sta(this.input)[start] === ' ') {
            start++;
        }
    
        while (_end > start && sta(this.input)[_end - 1] === ' ') {
            _end--;
        }
    
        text = "";
        for (let i = start; i < _end; i++) {
            text += sta(this.input)[i];
        }
    
        return text;
    }
}