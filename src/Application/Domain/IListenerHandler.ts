import IPayload from './IPayload';

type IListenerHandler = (payload: IPayload, context: any) => any;
export default IListenerHandler;