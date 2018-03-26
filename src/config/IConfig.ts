export interface IServerConfig {
	host: string | null;
	port: number;
}

export interface IConfig {
	weather: IServerConfig;
	laundry: IServerConfig;
}
