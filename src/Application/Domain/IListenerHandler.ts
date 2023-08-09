import type IPayload from './IPayload';

type IListenerHandler = (payload: IPayload, context) => void | IPayload;
export default IListenerHandler;
