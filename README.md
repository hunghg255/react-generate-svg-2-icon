# Generate Icon from Svg

## 1. Install

```bash
npm i @rgrove/parse-xml globby htmltojsx @rgrove/parse-xml svgson --save-dev
```

## 2. Create file scripts/generate-svg.js

```js
// Config path contains svgs and svg component
const SOURCE_PATH = './src/assets/svgs';
const OUTPUT_PATH = './src/components/Icon';
```

## 3. Add script package.json

```bash
 "scripts": {
    ...
    "g": "node scripts/generate-svg"
  },
```

## 4. Run

```bash
npm run g
```
