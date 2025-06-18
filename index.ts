// Require the necessary discord.js classes
import { REST, Routes } from 'discord.js'
import ChatClient from './tools/client/index.js'


const token = process.env.DISCORD_API_KEY!
const rest = new REST().setToken(token)

async function deploy() {
	try {
		console.log('Started refreshing application (/) commands.')

		// guild-specific dev env
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.TEST_ENV_GUILD_ID!), {
			body: Array.from(ChatClient.ChatClient.commands.values()).map(command => command.data.toJSON()),
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