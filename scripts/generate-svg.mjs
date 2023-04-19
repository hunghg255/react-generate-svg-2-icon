import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as globby from 'globby';
import HTMLtoJSX from 'htmltojsx';
import { parseXml } from '@rgrove/parse-xml';
import { stringify } from 'svgson';

const SOURCE_PATH = './src/assets/svgs';
const OUTPUT_PATH = './src/components/Icon';

const converter = new HTMLtoJSX({
  createClass: false,
});

const writeFile = promisify(fs.writeFile);

const formatChild = (children) => {
  const newChildren = [];

  for (let idx = 0; idx < children.length; idx++) {
    const element = children[idx];

    if (element.type === 'text') continue;

    if (element.name === 'path') {
      element.attributes.fill && delete element.attributes.fill;
      element.children = formatChild(element.children);
      newChildren.push(element);
    }
  }

  return newChildren;
};

const formatAttr = (obj) => {
  if (obj.name === 'svg') {
    obj.attributes.fill = 'currentColor';
    obj.attributes.width = '1em';
    obj.attributes.height = '1em';
  }

  obj.children = formatChild(obj.children);

  return obj;
};

const generateSvg = () => {
  const list = [];

  const __dirname = path.resolve();

  const capitalizeFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const updateCase = (name) => name.split('-').map(capitalizeFirstLetter).join('');

  globby.globbySync(`${SOURCE_PATH}/*.svg`, { cwd: __dirname }).forEach((p) => {
    const parsed = path.parse(p);
    const { name } = parsed;
    list.push({ name: 'Icon' + updateCase(slugify(name)), path: p });
  });

  for (let idx = 0; idx < list.length; idx++) {
    const svgPath = list[idx];

    const data = fs.readFileSync(svgPath.path, 'utf8');
    list[idx].svg = stringify(formatAttr(JSON.parse(JSON.stringify(parseXml(data).children[0]))));
  }

  return list;
};

async function generateIcons() {
  const __dirname = path.resolve();
  const iconsDir = path.join(__dirname, OUTPUT_PATH);

  try {
    await promisify(fs.access)(iconsDir);
  } catch (err) {
    await promisify(fs.mkdir)(iconsDir);
  }

  const list = generateSvg();

  const render = ({ svgIdentifier, content }) => {
    return `
import * as React from 'react';

const ${svgIdentifier} = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props}>
        ${content}
  </span>;
};

${svgIdentifier}.displayName = '${svgIdentifier}';

export default ${svgIdentifier};
`;
  };

  for (let idx = 0; idx < list.length; idx++) {
    const element = list[idx];

    writeFile(
      path.resolve(__dirname, `${OUTPUT_PATH}/${element.name}.tsx`),
      render({ svgIdentifier: element.name, content: converter.convert(element.svg).trim() }),
    );
  }

  // generate icon index
  const entryText = list
    .map((element) => `export { default as ${element.name} } from './${element.name}';`)
    .join('\n');

  writeFile(path.resolve(__dirname, `${OUTPUT_PATH}/index.tsx`), `${entryText}`.trim());
}

generateIcons();
