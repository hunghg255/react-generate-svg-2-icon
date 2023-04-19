import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as globby from 'globby';
import HTMLtoJSX from 'htmltojsx';
import { parseXml } from '@rgrove/parse-xml';
import { stringify } from 'svgson';

const PATH_FOLDER_SVGS = 'src/assets/svgs';
const PATH_FOLDER_ICONS = 'src/components/Icon';

const converter = new HTMLtoJSX({
  createClass: false,
});

const writeFile = promisify(fs.writeFile);
const __dirname = path.resolve();

/**
 * generateObjSvg
 * @returns [{ name: 'IconAbc', svg: '<svg>...</svg>'}]
 */
const generateObjSvg = () => {
  const listSvgObj = [];

  const formatChildrenSvg = (children) => {
    const newChildren = [];

    for (let idx = 0; idx < children.length; idx++) {
      const element = children[idx];

      if (element.type === 'text') continue;

      if (element.name === 'path') {
        element.attributes.fill && delete element.attributes.fill;
        element.children = formatChildrenSvg(element.children);
        newChildren.push(element);
      }
    }

    return newChildren;
  };

  const formatSvgAst = (obj) => {
    if (obj.name === 'svg') {
      obj.attributes.fill = 'currentColor';
      obj.attributes.width = '1em';
      obj.attributes.height = '1em';
    }

    obj.children = formatChildrenSvg(obj.children);

    return obj;
  };

  const capitalizeFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const updateCase = (name) => name.split('-').map(capitalizeFirstLetter).join('');

  // Gen Name
  globby.globbySync(`${PATH_FOLDER_SVGS}/*.svg`, { cwd: __dirname }).forEach((p) => {
    const parsed = path.parse(p);
    const { name } = parsed;
    listSvgObj.push({ name: 'Icon' + updateCase(slugify(name)), path: p });
  });

  // Gen Svg
  for (let idx = 0; idx < listSvgObj.length; idx++) {
    const svgPath = listSvgObj[idx];

    const data = fs.readFileSync(svgPath.path, 'utf8');
    listSvgObj[idx].svg = stringify(
      formatSvgAst(JSON.parse(JSON.stringify(parseXml(data).children[0]))),
    );
  }

  return listSvgObj;
};

const generateIcons = async () => {
  const iconsDir = path.join(__dirname, PATH_FOLDER_ICONS);

  try {
    await promisify(fs.access)(iconsDir);
  } catch (err) {
    await promisify(fs.mkdir)(iconsDir);
  }

  const listSvgObj = generateObjSvg();

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

  for (let idx = 0; idx < listSvgObj.length; idx++) {
    const element = listSvgObj[idx];

    writeFile(
      path.resolve(__dirname, `${PATH_FOLDER_ICONS}/${element.name}.tsx`),
      render({ svgIdentifier: element.name, content: converter.convert(element.svg).trim() }),
    );
  }

  // generate icon index
  const entryText = listSvgObj
    .map((element) => `export { default as ${element.name} } from './${element.name}';`)
    .join('\n');

  writeFile(path.resolve(__dirname, `${PATH_FOLDER_ICONS}/index.tsx`), `${entryText}`.trim());
};

generateIcons();
