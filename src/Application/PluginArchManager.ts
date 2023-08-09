/* eslint-disable guard-for-in */
// Domain
import type IListener from '@Domain/IListener';
// Application
import EventQueue from '@Application/EventQueue';
import ListenerStore from '@Application/ListenerStore';
import type IMiddleware from '@Domain/IMiddleware';
import type IListenerType from '@Domain/IListenerType';
import type IListenerHandler from '@Domain/IListenerHandler';

export default abstract class PluginArchManager extends EventQueue {
	protected store: ListenerStore = new ListenerStore(this);
	protected midStore: ListenerStore = new ListenerStore(this);
	protected allowedEvents: string[] = [];

	protected use(middleware: IMiddleware): void {
		const { on = {}, once = {}, onChannel: channel = {} } = middleware;
		const listeners = { on, once, channel };
		for (const type in listeners) {
			for (const name in listeners[ type ]) {
				this.midStore.add({
					name,
					type: type as IListenerType,
					handler: listeners[ type ][ name ] as IListenerHandler,
				});
			}
		}
	}

	protected removeListener(event: IListener): void {
		this.store.remove(event);
	}
}
