import { ChannelType, type Channel } from 'discord.js'

export function sendMessage(channel: Channel, message: string) {
	if (channel?.type === ChannelType.GuildText) {
		channel.send(message)
	}
}