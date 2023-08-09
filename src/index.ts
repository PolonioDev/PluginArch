// Domain
import type IChannelEvent from '@Domain/IChannelEvent';
import type IListenerHandler from '@Domain/IListenerHandler';
import type IListenerRule from '@Domain/IListenerRule';
import type IPayload from '@Domain/IPayload';
import type IRequestHandler from '@Domain/IRequestHandler';
// Application
import PluginArchManager from '@Application/PluginArchManager';
import type Listener from '@Application/Listener';

export default abstract class PluginArch extends PluginArchManager {
  public on(event_name: string, callback: IListenerHandler, rule?: IListenerRule): Listener {
    const event = this.store.add({
      name: event_name,
      type: 'on',
      handler: callback,
      rule
    });
    return event;
  }

  public once(event_name: string, callback: IListenerHandler, rule?: IListenerRule): Listener {
    const event = this.store.add({
      name: event_name,
      type: 'once',
      handler: callback,
      rule
    });
    return event;
  }

  public async request(content: IPayload): Promise<IPayload> {
    return new Promise<IPayload>(resolve => {
      const { id } = this.onChannel('response', (content: IPayload) => {
        resolve(content);
        this.emitToChannel('close', {}, id);
      });
      this.emitToChannel('request', { id, content });
    });
  }

  protected intercept(event_name: string, payload: IPayload, isChannel = false): IPayload {
    let parsedPayload: IPayload = event_name === 'any' ? payload : this.interceptAny(payload, isChannel);
    this.midStore.each(
      event_name,
      event => {
        parsedPayload = event.release(parsedPayload);
        return event.type === 'once';
      },
      isChannel ? 'channel' : undefined
    );
    return parsedPayload;
  }

  protected interceptAny(payload: IPayload, isChannel = false): IPayload {
    let parsedPayload = this.intercept('any', payload, isChannel);
    this.store.each(
      'any',
      event => {
        parsedPayload = event.release(parsedPayload);
        return event.type === 'once';
      },
      isChannel ? 'channel' : undefined
    );
    return parsedPayload;
  }

  protected emit(event_name: string, payload: IPayload = {}, id?: string): IPayload {
    let parsedPayload = this.intercept(event_name, payload);
    if (id) {
      return this.emitByID(event_name, id, parsedPayload);
    }

    this.store.each(event_name, event => {
      parsedPayload = event.release(parsedPayload);
      return event.type === 'once';
    });
    return parsedPayload;
  }

  protected emitToChannel(event_name: IChannelEvent, payload: IPayload, id?: string): IPayload {
    let parsedPayload = this.intercept(event_name, payload, true);
    if (id) {
      return this.emitToChannelByID(event_name, id, parsedPayload);
    }

    this.store.each(
      event_name,
      event => {
        parsedPayload = event.release(parsedPayload);
      },
      'channel'
    );
    return parsedPayload;
  }

  protected onChannel(event_name: string, callback: IListenerHandler, id?: string): Listener {
    const event = this.store.add({
      name: event_name,
      type: 'channel',
      handler: callback,
      id
    });
    return event;
  }

  protected onRequest(callback: IRequestHandler): Listener {
    return this.onChannel('request', ({ id, content }) => {
      callback(id as string, content as IPayload);
    });
  }

  protected async response(id: string, content: IPayload): Promise<void> {
    return new Promise<void>(resolve => {
      this.onChannel(
        'close',
        () => {
          resolve();
        },
        id
      );
      this.emitToChannel('response', content, id);
    });
  }

  private emitByID(event_name: string, id: string, payload: IPayload): IPayload {
    const event = this.store.search(event_name, id);
    let parsedPayload = payload;
    if (event) {
      parsedPayload = event.release(payload);
      if (event.type === 'once') {
        event.remove();
      }
    }

    return parsedPayload;
  }

  private emitToChannelByID(event_name: IChannelEvent, id: string, payload: IPayload): IPayload {
    const event = this.store.search(event_name, id, 'channel');
    let parsedPayload = payload;
    if (event) {
      parsedPayload = event.release(payload);
    }

    return parsedPayload;
  }
}
