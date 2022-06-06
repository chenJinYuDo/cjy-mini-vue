import ts from "rollup-plugin-ts";
export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'lib/mini-vue-cjs.js',
      format: 'cjs'
    },
    {
      file: 'lib/mini-vue-esm.js',
      format: 'esm'
    }
  ],
	plugins: [
		ts()
	]
};