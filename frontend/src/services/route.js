export function setRoutes(config) {
	let routes = [...config.routes];

	if (config.settings || config.auth) {
		routes = routes.map((route) => {
			let auth = config.auth ? [...config.auth] : null;
			auth = route.auth ? [...auth, ...route.auth] : auth;
			return {
				...route,
				auth,
			};
		});
	}

	return [...routes];
}

export function generateRoutesFromConfigs(configs) {
	let allRoutes = [];
	configs.forEach((config) => {
		allRoutes = [...allRoutes, ...setRoutes(config)];
	});
	return allRoutes;
}
