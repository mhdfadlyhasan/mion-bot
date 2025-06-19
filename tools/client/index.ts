import { ChannelType, Client, Collection, Events, GatewayIntentBits, type Channel } from 'discord.js'
import helloCommand from '../../commands/helper/hello'
import getTimeCommand from '../../commands/helper/get_time'
import livestreamCommand from '../../commands/domains/livestream-tracker'
import channelSearch from '../../commands/query/channel-search'
const chatClient = await new Client({ intents: [GatewayIntentBits.Guilds] })
var channel: Channel | undefined
const token = process.env.DISCORD_API_KEY!

export function sendMessage(message: string) {
	if (channel?.type === ChannelType.GuildText) {
		channel.send(message)
	}
}

declare module 'discord.js' {
	export interface Client {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		commands: Collection<any, any>
	}
}
chatClient.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
	channel = chatClient.channels.cache.get(process.env.TEST_DISCORD_CHANNEL_ID!)
	sendMessage('こんにちは, bot is starting!')
})

chatClient.once(Events.ShardDisconnect, disconnectClient => {
	sendMessage(`Disconnecting! ${disconnectClient.code}`)
})

chatClient.commands = new Collection()
chatClient.commands.set(helloCommand.data.name, helloCommand)
chatClient.commands.set(getTimeCommand.data.name, getTimeCommand)
chatClient.commands.set(livestreamCommand.data.name, livestreamCommand)
chatClient.commands.set(channelSearch.data.name, channelSearch)


chatClient.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = chatClient.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command found for ${interaction.commandName}`)
		return
	}

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({
			content: 'There was an error executing this command.',
			ephemeral: true,
		})
	}
})

chatClient.login(token)

export default {
	ChatClient: chatClient,
	Channel: channel,
}