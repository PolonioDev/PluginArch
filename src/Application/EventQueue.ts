import IPluginArch from '@Domain/IPluginArch';
import type IEventQueueStore from '@Domain/IEventQueueStore';
import type IEventOnQueue from '@Domain/IEventOnQueue';

export default abstract class EventQueue extends IPluginArch {
	protected queueStore: IEventQueueStore = {};

	enqueue(key: string, event: IEventOnQueue, isChannel=false): void {
		const args = this.parseFor('enqueue', { key, event, isChannel, preventDefault: false });
		if(args.preventDefault) return;
		this.queue(key)[ args.isChannel? 'channel':'content' ].push(args.event);
	}

	dequeue(key: string): boolean {
		const { preventDefault } = this.parseFor('dequeue', { key, preventDefault: false });
		let isFinish = preventDefault;
		if(!isFinish && !this.queue(key).isBusy){

			this.queue(key).isBusy = true;
			const queues = [ 'content', 'channel' ];
			queues.forEach(queue => {
				this.queue(key)[ queue ].forEach(({ event, payload, id }: IEventOnQueue) => {
					this.emit(event, payload, id);
				});
			});

			this.queue(key).isBusy = false;
			isFinish = true;
		}

		return isFinish;
	}

	private queue(key: string) {
		const { key: parsedKey, content } = this.parseFor('queue', { key, content: undefined });

		if(content !== undefined && !this.queueStore[ parsedKey ]){
			this.queueStore[ parsedKey ] = {
				isBusy: false,
				content: [],
				channel: []
			};
		}

		return content ?? this.queueStore[ parsedKey ];
	}
}
