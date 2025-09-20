import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	base: './',
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Phadonia Nonogram",
				short_name: "Phadonia Nonogram",
				description: "A puzzle game where you fill in cells based on numeric clues",
				theme_color: "hsl(240deg 69% 61%)",
				background_color: "hsl(240deg 16% 95%)",
				display: "standalone",
				start_url: "./",
				icons: [
					{
						src: "assets/img/icon1.ico",
						sizes: "16x16",
						type: "image/x-icon"
					},
					{
						src: "assets/img/icon2.ico",
						sizes: "32x32",
						type: "image/x-icon"
					},
					{
						src: "assets/img/icon3.ico",
						sizes: "64x64",
						type: "image/x-icon"
					},
					{
						src: "assets/img/icon4.ico",
						sizes: "128x128",
						type: "image/x-icon"
					},
					{
						src: "assets/img/icon5.ico",
						sizes: "256x256",
						type: "image/x-icon"
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
			},
		}),
	],
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
	},
});