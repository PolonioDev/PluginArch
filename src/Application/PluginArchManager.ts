 
// Domain
import type IListener from '@Domain/IListener';
import type IPlugin from '@Domain/IPlugin';
import type IListenerType from '@Domain/IListenerType';
import type IListenerHandler from '@Domain/IListenerHandler';
import type IChannelEvent from '@Domain/IChannelEvent';
import type IPayload from '@Domain/IPayload';
// Application
import EventQueue from '@Application/EventQueue';
import ListenerStore from '@Application/ListenerStore';

export default abstract class PluginArchManager extends EventQueue {
	protected store: ListenerStore = new ListenerStore(this);
	protected midStore: ListenerStore = new ListenerStore(this);
	protected allowedEvents: string[] = [];
	protected plugins: Record<string, IPlugin> = {};

	public use(plugin: IPlugin): void {
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(plugin))
			.concat(Object.keys(plugin)).filter(name => /^on(?=ce|Channel|).+Handler$/.test(name));
		methods.forEach(handlerName => {
			const handler = plugin[ handlerName ].bind(plugin) as IListenerHandler;
			this.plugins[ plugin.name ] = plugin;
			const type: string | undefined =
				handlerName.startsWith("on")				? 'on':
				handlerName.startsWith("once") 			? 'once': 
				handlerName.startsWith("onChannel") ? 'channel':
				undefined;

			if(type){
				let name = handlerName.substring(type.length+1, handlerName.length-7);
				name = handlerName.charAt(type.length).toLocaleLowerCase() + name;
				this.midStore.add({
					name,
					type: type as IListenerType,
					handler,
				});
			}
		});
		if(plugin.init) plugin.init();
	}

	protected removeListener(event: IListener): void {
		this.store.remove(event);
	}

	protected exec(from: string, command: string, ...args:[any]) {
		 return this.plugins[ from ][ command ](...args);
	}

	protected parseFor<T>(action: IChannelEvent, defaultPayload: T): T {
		return this.emitToChannel(action, defaultPayload as IPayload) as T;
	}
}
