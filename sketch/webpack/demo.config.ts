import * as fs from 'fs';
import * as minimist from 'minimist';
import * as path from 'path';

import {baseConfig} from './base.config';

// Allow for specific demos to built with a --demos=<someName>,<someOtherName>
// CLI format.
const args = minimist(process.argv.slice(2));
console.log("-------------", args)
const specified: string[] = args.demos ? args.demos.split(',') : [];

const getDemos = (source: any)  => {
  return fs.readdirSync(source)
      .filter(name => path.extname(name) === '.html' && name !== 'index.html')
      .map(name => path.basename(name, '.html'))
      .filter(demo => specified.length ? specified.includes(demo) : true);
};

const entries = getDemos('./demos').reduce(   (obj, name) => {
  // @ts-ignore
  obj[name] = `./demos/${name}.js`;
  return obj;
}, {});

module.exports = {
  ...baseConfig,
  devtool: 'inline-source-map',
  mode: 'development',
  entry: {
    ...entries,
  },
  output: {
    filename: '[name]_bundle.js',
    path: path.resolve(__dirname, '../demos'),
  },
  devServer: {
    contentBase: path.join(__dirname, '../demos'),
    port: 8080,
  },
};
