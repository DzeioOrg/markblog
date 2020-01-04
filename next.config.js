const withCSS = require('@zeit/next-stylus')
const glob = require('glob')
const withOffline = require('next-offline')
const matter = require('gray-matter')
const fs = require('fs')
// import posts from './posts/pages.json.ts'
// const posts = require('./posts/pages.json.ts')
// const t = require('./pages/portfolio/')
module.exports = withOffline(withCSS({
	/* config options here */
	exportTrailingSlash: true,
	// cssModules: true,
	// target: 'serverless',
	webpack: function(config) {
		config.module.rules.push({
			test: /\.md$/,
			use: 'raw-loader'
		})
		return config
	},
	plugins: [
		["styled-jsx/babel", { "optimizeForSpeed": true }]
	],
	exportPathMap: async function() {
		const paths = {
			'/': { page: '/'},
		}

		const posts = glob.sync('./posts/**/*.md')

		posts.forEach(element => {
			const datas = matter(fs.readFileSync(element)).data
			element = element.replace(/^.*[\\\/]/, '')
				.split('.')
				.slice(0, -1)
				.join('.')
			paths[`/${datas.category.toLowerCase()}/${datas.id}`] = { page: '/[category]/[slug]', query: {category: datas.category.toLowerCase(), slug: datas.id}}
			for (const tg of datas.tags) {
				paths[`/tag/${tg.toLowerCase()}`] = { page: '/tag/[tag]', query: {tag: tg}}
			}
		});

		return paths
	}
}))
