import IListenerHandler from './IListenerHandler';
import IListenerRule from './IListenerRule';
import IListenerType from './IListenerType';

export default interface IListenerBasis {
    id?: string;
    name: string;
    type: IListenerType;
    handler: IListenerHandler;
    rule?: IListenerRule;
};