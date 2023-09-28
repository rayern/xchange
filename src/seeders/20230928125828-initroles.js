"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"roles",
			[
				{
					name: "Admin",
          created_at: new Date(),
          updated_at: new Date()
				},
				{
					name: "User",
          created_at: new Date(),
          updated_at: new Date()
				},
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Role", null, {})
	},
}