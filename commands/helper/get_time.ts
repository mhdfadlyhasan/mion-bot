import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'


export default {
	data: new SlashCommandBuilder()
		.setName('get_time')
		.setDescription('Replies with current time!'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(Date().toString())
	},
}