import IPayload from './IPayload';

type IRequestHandler = (id: string, content: IPayload) => void;
export default IRequestHandler;