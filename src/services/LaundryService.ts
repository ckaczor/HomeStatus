import io from 'socket.io-client';

export class LaundryStatus {
	washer: boolean = false;
	dryer: boolean = false;
}

export class LaundryService {
	static socket: SocketIOClient.Socket | null;
	static status: LaundryStatus = new LaundryStatus();

	static start(server: string, port: number) {
		if (this.socket) {
			return;
		}

		this.socket = io(`http://${server}:${port}`);

		this.socket.on('status', (statusString: string) => {
			const newStatus = JSON.parse(statusString);

			if (newStatus.washer !== undefined) {
				this.status.washer = newStatus.washer;
			}

			if (newStatus.dryer !== undefined) {
				this.status.dryer = newStatus.dryer;
			}
		});

		this.socket.emit('getStatus');
	}
}
