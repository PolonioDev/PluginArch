import type IChannelEvent from './IChannelEvent';
import type IListener from './IListener';
import type IPayload from './IPayload';
import type IRequestHandler from './IRequestHandler';
import type IListenerHandler from './IListenerHandler';
import type IListenerStore from './IListenerStore';
import type IPlugin from './IPlugin';
import type IListenerRule from './IListenerRule';

export default abstract class IPluginArch {
  protected abstract allowedEvents: string[];
  protected abstract store: IListenerStore;
  protected abstract midStore: IListenerStore;
  public abstract on(event: string, callback: IListenerHandler): IListener;
  public abstract once(event: string, callback: IListenerHandler): IListener;
  public abstract request(content: IPayload): Promise<IPayload>;

  public abstract use(middleware: IPlugin): void;
  protected abstract emit(event: string, payload: IPayload, id?: string): IPayload;
  protected abstract intercept(event_name: string, payload: IPayload): IPayload;
  protected abstract onRequest(callback: IRequestHandler, rule?: IListenerRule): IListener;
  protected abstract response(id: string, content: IPayload): Promise<void>;
  protected abstract emitToChannel(event_name: IChannelEvent, payload: IPayload, id?: string): IPayload;
  protected abstract onChannel(event_name: string, callback: IListenerHandler, rule?: IListenerRule, id?: string): IListener;
  protected abstract parseFor<T>(action: IChannelEvent, defaultPayload: T): T;
}
