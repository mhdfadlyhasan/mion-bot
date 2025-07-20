export type ChannelEntry = {
	id: string
	videoId: string
	link: string
	title: string
	published: string
	updated: string
	group: {
		title: string
		community: {
			statistics: {
				views: string
			}
		}
	}
}


export type ChannelFeed = {
	link: string
	id: string
	title: string
	entry: ChannelEntry[]
}