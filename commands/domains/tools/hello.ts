import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('bruh')
		.setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Pong!')
	},
}