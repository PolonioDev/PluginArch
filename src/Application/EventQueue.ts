import IPluginArch from '@Domain/IPluginArch';
import type IEventQueueStore from '@Domain/IEventQueueStore';
import type IPayload from '@Domain/IPayload';

export default abstract class EventQueue extends IPluginArch {
	protected queueStore: IEventQueueStore = {};

	enqueue(key: string, event: string, payload: IPayload, id?: string): void {
		this.queue(key).content.push({
			event, payload, id
		});
	}

	enqueueOnChannel(key: string, event: string, payload: IPayload, id?: string): void {
		this.queue(key).channel.push({
			event, payload, id
		});
	}

	dequeue(key: string): boolean {
		let isFinish = false;
		if(!this.queue(key).isBusy){
			this.queue(key).isBusy = true;
			
			this.queue(key).content.map(({ event, payload, id }) => {
				this.emit(event, payload, id);
				return true;
			});

			this.queue(key).channel.map(({ event, payload, id }) => {
				this.emit(event, payload, id);
				return true;
			});

			this.queue(key).isBusy = false;
			isFinish = true;
		}


		return isFinish;
	}

	private queue(key: string) {
		if(!this.queueStore[ key ]){
			this.queueStore[ key ] = {
				isBusy: false,
				content: [],
				channel: []
			};
		}

		return this.queueStore[ key ];
	}

}
