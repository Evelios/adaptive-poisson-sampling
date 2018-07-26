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
    // // Node.js Build
    // {
    //   file: 'module.js',
    //   format: 'amd',
    //   interop: false,
    // },
    // // Browser Build
    // {
    //   name: 'Poisson',
    //   file: 'bundle.js',
    //   format: 'iife',
    //   interop: false,
    // },
    
  ],

};