import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  minify: true,
  target: 'es2017',
  bundle: true,
  format: 'esm',
  dts: true
})
