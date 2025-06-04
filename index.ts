// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js'
import helloCommand from './commands/domains/tools/hello'
import getTimeCommand from './commands/domains/tools/get_time'
declare module 'discord.js' {
	export interface Client {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		commands: Collection<any, any>
	}
}
const token = process.env.DISCORD_API_KEY

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.commands = new Collection()
client.commands.set(helloCommand.data.name, helloCommand)
client.commands.set(getTimeCommand.data.name, getTimeCommand)


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

client.login(token)
