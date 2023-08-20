import type IPayload from './IPayload';
import type IPluginArch from './IPluginArch';

type IListenerHandler = (payload: IPayload, context) => void | IPayload;
export default IListenerHandler;
