import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  resolve(),
  commonjs(),
];

export default {
  plugins,
  input: './adaptive-poisson-sampling.js',
  output: [
    // UMD Build
    {
      name: 'poisson',
      file: 'index.js',
      format: 'umd',
      interop: false,
    },    
  ],
};