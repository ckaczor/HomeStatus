import { IConfig } from './IConfig';

class Config implements IConfig {
	weather = {
		host: null,
		port: 9090
	};

	laundry = {
		host: null,
		port: 9091
	};
}

export const config = new Config();
