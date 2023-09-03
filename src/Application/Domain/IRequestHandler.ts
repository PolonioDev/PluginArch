import type IPayload from './IPayload';

type IRequestHandler = (id: string, content: IPayload, context) => void;
export default IRequestHandler;
