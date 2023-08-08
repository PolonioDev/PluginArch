// Domain
import IListener from '@Domain/IListener';
// Application
import EventQueue from '@Application/EventQueue';
import ListenerStore from '@Application/ListenerStore';
import IMiddleware from '@Domain/IMiddleware';
import IListenerType from '@Domain/IListenerType';

export default abstract class PluginArchManager extends EventQueue {
    protected store: ListenerStore = new ListenerStore(this);
    protected midStore: ListenerStore = new ListenerStore(this);
    protected allowedEvents: string[] = [];


    protected use(middleware: IMiddleware): void {
        const { on = {}, once = {}, onChannel = {} } = middleware;
        const listeners = {
            on, once,
            channel: onChannel
        };
        for (let type in listeners) {
            for (let name in listeners[type]) {
                this.midStore.add({
                    name, type: type as IListenerType,
                    handler: listeners[type][name]
                })
            }
        }
    }

    protected removeListener(event: IListener): void {
        this.store.remove(event);
    }
}