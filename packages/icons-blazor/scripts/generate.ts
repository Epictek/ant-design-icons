import * as allIconDefs from '@ant-design/icons-svg';
import { IconDefinition, ThemeType } from '@ant-design/icons-svg/es/types';
import { renderIconDefinitionToSVGElement } from '@ant-design/icons-svg/lib/helpers';
import { promises as fsPromises } from 'fs';
import { template } from 'lodash';
import * as path from 'path';


interface IconDefinitionWithIdentifier extends IconDefinition {
  svgIdentifier: string;
}

function walk<T>(fn: (iconDef: IconDefinitionWithIdentifier) => Promise<T>) {
  return Promise.all(
    Object.keys(allIconDefs).map(svgIdentifier => {
      const iconDef = (allIconDefs as { [id: string]: IconDefinition })[
        svgIdentifier
      ];

      return fn({ svgIdentifier, ...iconDef });
    })
  );
}


async function generateIcons() {

  const iconsDir = path.join(__dirname, '../src/icons');
  try {
    await fsPromises.access(iconsDir);
  } catch {
    await fsPromises.mkdir(iconsDir);
  }

  const svgRender = template(`<%= inlineIcon %>`);


  await walk(async ({ svgIdentifier, name, theme, icon }) => {
    const inlineIcon = renderIconDefinitionToSVGElement({ name, theme, icon });
  
    await fsPromises.writeFile(
      path.resolve(__dirname, `../src/icons/${svgIdentifier}.razor`),
      svgRender({ inlineIcon })
    );
  
  });
}

generateIcons();

