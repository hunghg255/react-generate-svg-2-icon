# Generate Icon from Svg

## 1. Install

```bash
npm i @rgrove/parse-xml globby htmltojsx @rgrove/parse-xml svgson --save-dev
```

## 2. Create file scripts/generate-svg.mjs

```js
// Config path contains svgs and svg component
const PATH_FOLDER_SVGS = 'src/assets/svgs';
const PATH_FOLDER_ICONS = 'src/components/Icon';
```

## 3. Add script package.json

```bash
 "scripts": {
    ...
    "g": "node scripts/generate-svg.mjs"
  },
```

## 4. Run

```bash
npm run g
```
