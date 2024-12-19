import { length, sta, trim } from "../utils/string";
import { CSSRule } from "./type";

export class CSSParser {
    private pos = 0;
    private input: string;

    constructor(input: string) {
        this.input = input;
    }

    parse(): CSSRule[] {
        const rules: CSSRule[] = [];
        
        while (this.pos < length(this.input)) {
            this.skipWhitespace();
            
            if (this.pos >= length(this.input)) break;
            
            const selector = this.parseSelector();
            const properties = this.parseProperties();
            
            const hasProperties = next(properties)[0] !== undefined;
            
            if (selector && hasProperties) {
                rules.push({
                    selector,
                    properties
                });
            }
        }
    
        return rules;
    }
    
    

    private parseSelector(): string {
        let selector = "";
        let start = 0;
        let _end = 0;
    
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== "{") {
            selector += sta(this.input)[this.pos];
            this.pos++;
            _end++;
        }
    
        // Find the start index of the first non-space character
        while (start < _end && sta(this.input)[start] === ' ') {
            start++;
        }
    
        // Find the _end index of the last non-space character
        while (_end > start && sta(this.input)[_end - 1] === ' ') {
            _end--;
        }
    
        // Extract the trimmed selector
        selector = "";
        for (let i = start; i < _end; i++) {
            selector += sta(this.input)[i];
        }
    
        this.pos++; // Skip opening brace
        return selector;
    }

    private parseProperties(): Record<string, string> {
        const properties: Record<string, string> = {};
        
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== "}") {
            this.skipWhitespace();
            
            const property = this.parseProperty();
            if (property) {
                const [name, value] = property;
                properties[name] = value;
            }
            
            this.skipWhitespace();
        }
        
        this.pos++; // Skip closing brace
        return properties;
    }

    private parseProperty(): [string, string] | undefined {
        let name = "";
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== ":") {
            name += sta(this.input)[this.pos];
            this.pos++;
        }
        
        if (this.pos >= length(this.input)) return undefined;
        
        this.pos++; // Skip colon
        this.skipWhitespace();
        
        let value = "";
        while (this.pos < length(this.input) && sta(this.input)[this.pos] !== ";" && sta(this.input)[this.pos] !== "}") {
            value += sta(this.input)[this.pos];
            this.pos++;
        }
        
        if (sta(this.input)[this.pos] === ";") this.pos++; // Skip semicolon
        
        return [trim(name), trim(value)];
    }

    private skipWhitespace(): void {
        while (this.pos < length(this.input) && 
               (sta(this.input)[this.pos] === ' ' || 
                sta(this.input)[this.pos] === '\t' || 
                sta(this.input)[this.pos] === '\n' || 
                sta(this.input)[this.pos] === '\r')) {
          this.pos++;
        }
      }
}