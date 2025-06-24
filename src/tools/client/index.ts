import { ChannelType, Client as DiscordClient, Collection, Events, GatewayIntentBits, type Channel } from 'discord.js'
import helloCommand from '../../helper/hello'
import getTimeCommand from '../../helper/get_time'
import livestreamCommand from '../../domains/livestream-tracker'
import livestreamerSearch from '../../domains/livestreamer-search'
import searchStream from '../../query/channel-search'
import { redisGetAllKey } from '../redis.ts'
let channel: Channel | undefined
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

const chatClient = await new DiscordClient({ intents: [GatewayIntentBits.Guilds] })
chatClient.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
	channel = chatClient.channels.cache.get(process.env.TEST_DISCORD_CHANNEL_ID!)
	const names = await redisGetAllKey()
	for (const name of names) {
		console.log(await searchStream(name))
	}
})

chatClient.once(Events.ShardDisconnect, disconnectClient => {
	sendMessage(`Disconnecting! ${disconnectClient.code}`)
})

chatClient.commands = new Collection()
chatClient.commands.set(helloCommand.data.name, helloCommand)
chatClient.commands.set(getTimeCommand.data.name, getTimeCommand)
chatClient.commands.set(livestreamCommand.data.name, livestreamCommand)
chatClient.commands.set(livestreamerSearch.data.name, livestreamerSearch)


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