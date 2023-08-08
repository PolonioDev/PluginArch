import IListenerHandler from './IListenerHandler';
import IListenerRule from './IListenerRule';
import IListenerStore from './IListenerStore';
import IPayload from './IPayload';

export default abstract class IListener {
    protected abstract _name: string;
    protected abstract _type: string;
    protected abstract _id: string;
    protected abstract _rule?: IListenerRule;
    protected abstract _handler: IListenerHandler;
    protected abstract _store: IListenerStore;

    abstract get name(): string;
    abstract get type(): string;
    abstract get id(): string;
    abstract get rule(): IListenerRule;
    public abstract release(payload: IPayload): any;
    public abstract remove(): void;
}