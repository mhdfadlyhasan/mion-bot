import { ChannelType, Client as DiscordClient, Collection, Events, GatewayIntentBits, type Channel } from 'discord.js'
import livestreamerSearch from '../../commands/livestreamer-search'
import jishoSearch from '../../commands/jisho-search'
import addChannel from '../../commands/add-channel/index.ts'
import kanjiBreakdown from '../../commands/kanji-breakdown/index.ts'

import { mentionJisho } from '../../domain/mention-jisho/index.ts'
import { redisGetAllKey } from '../redis/index.ts'
import { searchStreamList } from '../../domain/search-stream/index.ts'
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

const chatClient = await new DiscordClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })
chatClient.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
	channel = chatClient.channels.cache.get(process.env.TEST_DISCORD_CHANNEL_ID!)
	const names = await redisGetAllKey()
	console.log(searchStreamList(names))
})

chatClient.once(Events.ShardDisconnect, disconnectClient => {
	sendMessage(`Disconnecting! ${disconnectClient.code}`)
})

chatClient.commands = new Collection()
chatClient.commands.set(livestreamerSearch.data.name, livestreamerSearch)
chatClient.commands.set(jishoSearch.data.name, jishoSearch)
chatClient.commands.set(addChannel.data.name, addChannel)
chatClient.commands.set(kanjiBreakdown.data.name, kanjiBreakdown)


chatClient.on(Events.MessageCreate, async interaction => {
	if (!interaction.mentions.everyone && interaction.mentions.has(process.env.CLIENT_ID!)) {
		mentionJisho(interaction)
	}
})


chatClient.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = chatClient.commands.get(interaction.commandName)
	if (!command) {
		console.error(`No command found for ${interaction.commandName}`)
		return
	}

	// sendTextWithButton(interaction)
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