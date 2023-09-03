import type IListener from './IListener';
import type IPayload from './IPayload';

type IListenerHandler = (payload: IPayload, context, event: IListener) => void | IPayload;
export default IListenerHandler;
