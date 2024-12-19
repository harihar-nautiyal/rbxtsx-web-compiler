# @rbxtsx/web-compiler

**UNDER DEVELOPMENT**

A TypeScript-based web compiler for Roblox, allowing you to compile HTML and CSS into Roblox UI components.



## Important Configuration

### 1. Update tsconfig.json
Add `@rbxtsx` to your typeRoots:
```json
{
  "compilerOptions": {
    "typeRoots": [
      "node_modules/@rbxts",
      "node_modules/@rbxtsx",  // Add this line
      "node_modules/@types"
    ]
  }
}
```

2. Update default.project.json

Add the `@rbxtsx` scope to your Rojo configuration:

```json
{
  "ReplicatedStorage": {
    "$className": "ReplicatedStorage",
    "rbxts_include": {
      "$path": "include",
      "node_modules": {
        "$className": "Folder",
        "@rbxts": {
          "$path": "node_modules/@rbxts"
        },
        "@rbxtsx": {           // Add this block
          "$path": "node_modules/@rbxtsx"
        }
      }
    }
  }
}

```

## Installation

```bash
npm install @rbxtsx/web-compiler
```

## Features

- Converts HTML elements to Roblox UI instances
- Transforms CSS styles to Roblox properties
- Supports basic HTML tags (div, span, button, input)
- Handles common CSS properties
- TypeScript support

## Usage

```typescript
import { HTMLParser, CSSParser, Transformer } from "@rbxtsx/web-compiler";

// Parse HTML
const htmlParser = new HTMLParser(htmlString);
const htmlAst = htmlParser.parse();

// Parse CSS
const cssParser = new CSSParser(cssString);
const cssRules = cssParser.parse();

// Transform to Roblox code
const transformer = new Transformer();
const robloxCode = transformer.transformHTML(htmlAst);
const robloxStyles = transformer.transformCSS(cssRules);
```

## HTML Support

Supported HTML elements:
- `<div>` → Frame
- `<span>` → TextLabel
- `<button>` → TextButton
- `<input>` → TextBox

## CSS Support

Supported CSS properties:
- `background-color` → BackgroundColor3
- `color` → TextColor3
- `font-size` → TextSize
- `width` → Size.X
- `height` → Size.Y

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Harihar Nautiyal

## Last Updated

2024-12-19

## Support

For issues and feature requests, please use the [GitHub issues page](https://github.com/yourusername/web-compiler/issues).

## Note

This package is under development and designed specifically for use with roblox-ts and may not work in other environments.
