module.exports = {
    app:{
        name: 'AuthBase'
    },
	jwt: {
		expiry: "3d",
	},
	cookie: {
		name: "auth_user",
		expiry: 25892000000
	},
	user: {
		password: {
			reset: {
				validity: 86400000,
			},
		},
	},
};