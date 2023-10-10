// Domain
import type IChannelEvent from '@Domain/IChannelEvent';
import type IListenerHandler from '@Domain/IListenerHandler';
import type IListenerRule from '@Domain/IListenerRule';
import type IPayload from '@Domain/IPayload';
import type IRequestHandler from '@Domain/IRequestHandler';
import type IListenerType from '@Domain/IListenerType';
import type IAnyPayload from '@Domain/IAnyPayload';
// Application
import PluginArchManager from '@Application/PluginArchManager';
import type Listener from '@Application/Listener';

/**
 * Abstract class representing a plugin architecture.
 * 
 * This class extends the PluginArchManager class and provides methods for registering and handling events, as well as sending and receiving messages through channels. It also allows for the use of middleware functions to intercept and modify event payloads.
 * 
 * @example
 * // Create a new instance of a class that extends PluginArch
 * const core = new PluginArchExample();
 * 
 * // Register an event listener
 * core.on('event_name', (payload, context) => {
 *   // Handle the event
 * });
 * 
 * // Send a request and wait for a response
 * core.request({ data: 'example' }).then(response => {
 *   // Handle the response
 * });
 */
export default abstract class PluginArch extends PluginArchManager {
  /**
   * Adds a new event listener to the store.
   * 
   * @param event_name The name of the event.
   * @param callback A callback function that will be executed when the event occurs.
   *                 The callback function takes two parameters: payload (IPayload) and context (any).
   *                 It can return either void or an IPayload object.
   * @param rule An optional rule object that can be used to define additional conditions for the event listener.
   * @returns A listener that can be used to unsubscribe from the event.
   */
  public on(event_name: string, callback: IListenerHandler, rule?: IListenerRule): Listener {
    const event = this.store.add({
      name: event_name,
      type: 'on',
      handler: callback,
      rule
    });
    return event;
  }

  /**
   * Adds a listener to the store that will be triggered only once when a specific event occurs.
   * 
   * @param event_name The name of the event to listen for.
   * @param callback A callback function that will be executed when the event occurs.
   *                 The callback function takes two parameters: payload (IPayload) and context (any).
   *                 It can return either void or an IPayload object.
   * @param rule An optional rule object that can be used to specify additional conditions for triggering the listener.
   * @returns A listener that can be used to unsubscribe from the event.
   */
  public once(event_name: string, callback: IListenerHandler, rule?: IListenerRule): Listener {
    const event = this.store.add({
      name: event_name,
      type: 'once',
      handler: callback,
      rule
    });
    return event;
  }

  /**
   * It sends a request through a temporary communication channel separate
   * from the events that the system listens for to prevent the collision
   * of events and waits for a response. The agent resolving the request
   * will be notified when the requesting agent receives its response.
   * 
   * @param content - The payload to send with the request.
   * @returns A promise that resolves to the received response.
   */
  public async request(content: IPayload): Promise<IPayload> {
    return new Promise<IPayload>(resolve => {
      const { id } = this.onChannel('response', (content: IPayload) => {
        resolve(content);
        this.emitToChannel('close', {}, id);
      });
      this.emitToChannel('request', { id, content });
    });
  }

  /**
   * Import listeners from another PluginArch class.
   * @param {PluginArch} to - The "to" parameter is an object of type PluginArch.
   */
  public import(to: PluginArch) {
    this.store.eachAll(listener => {
      const { type, name, rule, handler } = listener;
      to[ type as IListenerType ].call(name, handler, rule);
    });
    this.midStore.eachAll(listener => {
      const { type, name, rule, handler } = listener;
      to[ type as IListenerType ].call(name, handler, rule);
    });
  }

 /**
  * The relay method in the PluginArch class is used to relay events from one instance
  * of PluginArch to another. It listens for all events on the from instance and
  * emits the same event on the current instance.
  * @param {PluginArch} from - Class that emits the events that will be broadcast to the current class.
  * @example
  * const plugin1 = new PluginArch();
  * const plugin2 = new PluginArch();
  *
  * // Relay events from plugin1 to plugin2
  * plugin2.relay(plugin1);
  */
  public relay(from: PluginArch) {
    from.on('any', ({ event, payload }, _context, listener) => {
      this.emit(event as string, payload as IPayload, listener.id);
    });
  }

  /**
   * This function intercepts the payload of a certain event and is
   * processed by the event handlers in the plugins and provided by
   * the user. It always processes generic handlers first, then event
   * handlers in plugins, and then user event handlers. The order in
   * which drivers and plugins are registered is always respected.
   * 
   * @param event_name - The name of the event to intercept.
   * @param payload - The payload to be intercepted and processed.
   * @param isChannel - Optional parameter that indicates if the payload
   *  is intended for channel type events. The default is false.
   * @returns The processed payload.
   */
  protected intercept(event_name: string, payload: IPayload, isChannel = false): IPayload {
    let parsedPayload: IPayload = event_name === 'any' ? payload : 
      this.interceptAny({ event: event_name, payload }, isChannel);
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

  /**
   * This function intercepts the payload of any event and is processed by
   * the generic event handlers in the plugins and provided by the user. 
   * It always processes generic handlers in plugins first and then generic
   * user handlers. The order in which drivers and plugins are registered 
   * is always respected.
   * 
   * @param payload - The payload to be intercepted and processed.
   * @param isChannel - Optional parameter that indicates if the payload
   *  is intended for channel type events. The default is false.
   * @returns The processed payload.
   */
  protected interceptAny(payload: IAnyPayload, isChannel = false): IPayload {
    let parsedPayload = this.intercept('any', payload, isChannel);
    this.store.each(
      'any',
      event => {
        parsedPayload = event.release(parsedPayload);
        return event.type === 'once';
      },
      isChannel ? 'channel' : undefined
    );
    return parsedPayload.payload;
  }

  /**
   * Emits an event with a payload.
   * 
   * @param event_name The name of the event to emit.
   * @param payload The data to be passed along with the event. Defaults to an empty object.
   * @param id The ID of the specific handler that you want to process the event.
   * If provided, only the event for the specified handler will be emitted.
   * @returns The analyzed payload after being intercepted and processed.
   * If no event handler modifies the payload it is returned.
   */
  protected emit(event_name: string, payload: IPayload = {}, id?: string): IPayload {
    let parsedPayload = this.intercept(event_name, payload);
    if (id) {
      return this.emitByID(event_name, id, parsedPayload);
    }

    this.store.each(event_name, event => {
      parsedPayload = event.release(parsedPayload);
    });
    return parsedPayload;
  }

  /**
   * Emits events to a channel.
   * 
   * @param event_name The name of the event to emit.
   * @param payload The data to be passed along with the event. Defaults to an empty object.
   * @param id The ID of the specific handler that you want to process the event.
   * If provided, only the event for the specified handler will be emitted.
   * @returns The analyzed payload after being intercepted and processed.
   * If no event handler modifies the payload it is returned.
   */
  protected emitToChannel(event_name: IChannelEvent, payload: IPayload={}, id?: string): IPayload {
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

  /**
   * Adds a new event listener to the channel.
   * 
   * @param event_name The name of the event to listen for.
   * @param callback The function to be executed when the event occurs.
   * @param id (optional) An custom identifier for the event listener.
   * It is recommended not to specify this parameter unless you are absolutely
   * sure what you are doing, specifying this parameter can cause identifier collisions.
   * @returns A listener that can be used to unsubscribe from the event.
   */
  protected onChannel(event_name: string, callback: IListenerHandler, rule?: IListenerRule, id?: string): Listener {
    const event = this.store.add({
      name: event_name,
      type: 'channel',
      handler: callback,
      id,
      rule
    });
    return event;
  }

  /**
   * This method sets up a listener for incoming requests. When a request is received,
   * the provided callback function will be executed with the request ID and payload
   * content as arguments.
   * 
   * @param callback The callback function to be executed when a request is received.
   * @returns A listener that can be used to unsubscribe from the event.
   */
  protected onRequest(callback: IRequestHandler, rule?: IListenerRule): Listener {
    return this.onChannel('request', ({ id, content }, context) => {
      callback.call(this, id as string, content as IPayload, context);
    }, rule);
  }

  /**
   * Sends a response for a given request.
   * 
   * @param id - The ID of the request to which you want to respond.
   * @param content - The payload content of the response event.
   * @returns A promise that is resolved when the requester receives your response.
   * 
   * @example
   * const core = new PluginArchExtends();
   * core.response(RequestID, { response: 'Great Job!' })
   *   .then(() => {
   *     console.log('Response event handled successfully');
   *   })
   *   .catch((error) => {
   *     console.error('Error handling response event:', error);
   *   });
   */
  protected async response(id: string, content: IPayload): Promise<void> {
    return new Promise<void>(resolve => {
      this.onChannel('close', ()=>{ resolve(); }, {}, id);
      this.emitToChannel('response', content, id);
    });
  }

  /**
   * Emits an event for specific listener.
   * 
   * @param event_name The name of the event to emit.
   * @param payload The data to be passed along with the event.
   * @param id The ID of the specific handler that you want to process the event.
   * @returns The analyzed payload after being intercepted and processed.
   * If no event handler modifies the payload it is returned.
   */
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

  /**
   * Emits an event for specific listener by a channel.
   * 
   * @param event_name The name of the event to emit.
   * @param payload The data to be passed along with the event.
   * @param id The ID of the specific handler that you want to process the event.
   * @returns The analyzed payload after being intercepted and processed.
   * If no event handler modifies the payload it is returned.
   */
  private emitToChannelByID(event_name: IChannelEvent, id: string, payload: IPayload): IPayload {
    const event = this.store.search(event_name, id, 'channel');
    let parsedPayload = payload;
    if (event) {
      parsedPayload = event.release(payload);
    }

    return parsedPayload;
  }
}
