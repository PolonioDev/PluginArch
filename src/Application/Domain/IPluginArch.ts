import IChannelEvent from './IChannelEvent';
import IListener from './IListener';
import IPayload from './IPayload';
import IRequestHandler from './IRequestHandler';
import IListenerHandler from './IListenerHandler';
import IListenerStore from './IListenerStore';
import IMiddleware from './IMiddleware';

export default abstract class IPluginArch {
    protected abstract allowedEvents: string[];
    protected abstract store: IListenerStore;
    protected abstract midStore: IListenerStore;

    protected abstract use(middleware: IMiddleware): void;
    protected abstract emit(event: string, payload: IPayload, id?: string): IPayload;
    protected abstract intercept(event_name: string, payload: IPayload): IPayload;
    public abstract on(event: string, callback: IListenerHandler): IListener;
    public abstract once(event: string, callback: IListenerHandler): IListener;
    protected abstract onRequest(callback: IRequestHandler): IListener;
    public abstract request(content: IPayload): Promise<IPayload>;
    protected abstract response(id: string, content: IPayload): Promise<void>;
    protected abstract emitToChannel(event_name: IChannelEvent, payload: IPayload, id?: string): IPayload;
    protected abstract onChannel(event_name: string, callback: IListenerHandler, id?: string): IListener;
}