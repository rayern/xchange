import * as SmartyStreetsSDK from "smartystreets-javascript-sdk";
import "dotenv/config";

export const fetchLatLon = async (input) => {
	const { address, address2, city, state, zip } = input;
	const smartyStreetCore = SmartyStreetsSDK.default.core;

	let clientBuilder = new smartyStreetCore.ClientBuilder(
		new smartyStreetCore.StaticCredentials(
			process.env.SMARTY_STREET_AUTH_ID,
			process.env.SMARTY_STREET_AUTH_TOKEN
		)
	);
	let client = clientBuilder.buildUsStreetApiClient();

	const lookup = new SmartyStreetsSDK.default.usStreet.Lookup();
	lookup.street = address;
	lookup.street2 = address2;
	lookup.city = city;
	lookup.state = state;
	lookup.zipCode = zip;
	lookup.match = "invalid";

	try {
		const response = await client.send(lookup);
		if (response.lookups[0].result.length == 0) {
			throw new Error();
		}
		const result = response.lookups[0].result[0];
		const { latitude, longitude } = result.metadata;
		return {
			latitude: latitude,
			longitude: longitude,
		};
	} catch (error) {
		console.log(error);
		throw new Error("Invalid address. Please add more specific details");
	}
};
