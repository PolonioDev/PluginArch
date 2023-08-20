import type IPayload from './IPayload';
import type IPluginArch from './IPluginArch';

type IRequestHandler = (id: string, content: IPayload, context) => void;
export default IRequestHandler;
