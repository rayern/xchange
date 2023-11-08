module.exports = {
    app:{
        name: 'AuthBase'
    },
	jwt: {
		expiry: "3d",
	},
	cookie: {
		name: "auth_user",
	},
	user: {
		password: {
			reset: {
				validity: 86400000,
			},
		},
	},
};
