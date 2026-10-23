import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function build() {
  console.log('⚡ Building React applications with esbuild...');
  const startTime = Date.now();

  try {
    await esbuild.build({
      entryPoints: {
        menu: path.join(rootDir, 'src/entries/menu.jsx'),
        landing: path.join(rootDir, 'src/entries/landing.jsx'),
        admin: path.join(rootDir, 'src/entries/admin.jsx'),
        superadmin: path.join(rootDir, 'src/entries/superadmin.jsx'),
      },
      outdir: path.join(rootDir, 'public/dist'),
      bundle: true,
      minify: true,
      format: 'esm',
      target: ['es2020'],
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    });

    console.log(`✅ Build completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
