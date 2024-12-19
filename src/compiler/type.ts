export interface HTMLNode {
    type: string;
    attributes: Record<string, string>;
    children: (HTMLNode | string)[];
    parent?: HTMLNode;
}

export interface CSSRule {
    selector: string;
    properties: Record<string, string>;
}