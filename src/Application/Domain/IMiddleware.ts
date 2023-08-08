import IPayload from './IPayload';

export default interface IMiddleware {
    name: string;
    // version: string;
    description: string;
    author: string;
    // license: string;
    // repository?: string;
    // bugs?: string;
    // homepage?: string;

    // requiredAccess: string[];
    // init: () => void;

    on?: {
        [event: string]: (payload: IPayload) => void|IPayload;
    };

    once?: {
        [event: string]: (payload: IPayload) => void|IPayload;
    };

    onChannel?: {
        [event: string]: (payload: IPayload) => void|IPayload;
    };
};