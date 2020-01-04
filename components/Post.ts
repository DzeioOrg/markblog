import matter from 'gray-matter'


interface PostInterface {
	slug: string
	title: string
	content: any
}

export interface PostHeader {
	title: string
	id: string
	category: string
	image?: string
	imageAlt?: string
	date: Date
	url?: string
	tags?: string[]
}

export default class Post implements PostInterface {

	public slug: string
	public title: string
	public content: string
	public isStarted = false

	public header: PostHeader

	constructor(slug: string) {
		this.slug = slug
	}

	public async fetch() {
		if (!this.slug.endsWith(".md")) this.slug = "portfolio/" + this.slug +  ".md"
		const content = await import(`../posts/${this.slug}`)
		const md = matter(content.default)
		this.title = md.data.title
		this.header = (md.data as PostHeader)
		this.content = md.content
	}

	public fetchSync() {
		if (!this.slug.endsWith(".md")) this.slug = "portfolio/" + this.slug +  ".md"
		const content = require(`../posts/${this.slug}`)
		const md = matter(content.default)
		this.title = md.data.title
		this.header = (md.data as PostHeader)
		this.content = md.content
	}

	public static async fetchAll(): Promise<Post[]> {
			const files: string[] = ((require as any).context('../posts', true, /\.md$/)).keys()
			const posts: Post[] = []
			for (const file of files) {
				posts.push(
					new Post(
						file.replace("./", '')
					)
				)
			}
			return posts
	}
}
