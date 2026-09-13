import { defineConfig } from 'vite'
import path from 'path';
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		babel({ presets: [reactCompilerPreset()] })
	],
	build: {
		outDir: path.resolve(__dirname, '../server/public'),
		emptyOutDir: true,
	},
})
