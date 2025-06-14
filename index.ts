// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, Collection, REST, Routes } from 'discord.js'
import helloCommand from './commands/helper/hello'
import getTimeCommand from './commands/helper/get_time'
import livestreamCommand from './commands/domains/livestream-tracker'
import channelSearch from './commands/query/channel-search'
import { sendMessage } from './commands/helper/send_message'
import { redisGet } from './tools/redis.ts'


const token = process.env.DISCORD_API_KEY!
const rest = new REST().setToken(token)

declare module 'discord.js' {
	export interface Client {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		commands: Collection<any, any>
	}
}
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
	const channel = client.channels.cache.get(process.env.TEST_DISCORD_CHANNEL_ID!)
	sendMessage(channel!, 'こんにちは, bot is starting!')
})

client.once(Events.ShardDisconnect, disconnectClient => {
	const channel = client.channels.cache.get(process.env.TEST_DISCORD_CHANNEL_ID!)
	sendMessage(channel!, `Disconnecting! ${disconnectClient.code}`)
})

client.commands = new Collection()
client.commands.set(helloCommand.data.name, helloCommand)
client.commands.set(getTimeCommand.data.name, getTimeCommand)
client.commands.set(livestreamCommand.data.name, livestreamCommand)
client.commands.set(channelSearch.data.name, channelSearch)


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = client.commands.get(interaction.commandName)

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


async function deploy() {
	try {
		console.log('Started refreshing application (/) commands.')

		// guild-specific dev env
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.TEST_ENV_GUILD_ID!), {
			body: Array.from(client.commands.values()).map(command => command.data.toJSON()),
		})
		// Todo global, prod
		// await rest.put(Routes.applicationCommands(CLIENT_ID), {
		// 	body: Array.from(client.commands.values()).map(command => command.data.toJSON()),
		// })

		console.log('Successfully reloaded application (/) commands.')
	} catch (error) {
		console.error(error)
	}
}

deploy()
client.login(token)