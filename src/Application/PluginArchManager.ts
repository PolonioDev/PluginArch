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

	public use(middleware: IMiddleware): void {
		const { on = {}, once = {}, onChannel: channel = {} } = middleware;
		const listeners = { on, once, channel };
		for (const type in listeners) {
			for (const name in listeners[ type ]) {
				const handler = listeners[ type ][ name ] as IListenerHandler;
				this.midStore.add({
					name,
					type: type as IListenerType,
					handler: handler.bind(middleware),
				});
			}
		}

		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(middleware))
		.concat(Object.keys(middleware)).filter(name => /^on(ce|onChannel|)/.test(name));
		methods.forEach(handlerName => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const handler = middleware[ handlerName ];
			if(handlerName.endsWith("Handler")){
				let type: string | undefined;

				if(handlerName.startsWith("on")){
					type = 'on';
				}else if(handlerName.startsWith("once")){
					type = 'once';
				}else if(handlerName.startsWith("onChannel")){
					type = 'chennel';
				}

				if(type){
					let name = handlerName.substring(type.length+1, handlerName.length-7);
					name = handlerName.charAt(type.length).toLocaleLowerCase() + name;
					this.midStore.add({
						name,
						type: type as IListenerType,
						handler: (handler as IListenerHandler).bind(middleware) ,
					});
				}
			}
		})
	}

	protected removeListener(event: IListener): void {
		this.store.remove(event);
	}
}
