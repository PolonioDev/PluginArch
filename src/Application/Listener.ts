// Domain
import IListenerBasis from '@Domain/IListenerBasis';
import IListenerHandler from '@Domain/IListenerHandler';
import IListenerRule from '@Domain/IListenerRule';
import IListener from '@Domain/IListener';
import IPayload from '@Domain/IPayload';
import IPluginArch from '@Domain/IPluginArch';
// Application
import ListenerStore from '@Application/ListenerStore';

export default class Listener extends IListener {
    protected _name: string;
    protected _type: string;
    protected _id: string;
    protected _rule?: IListenerRule;
    protected _handler: IListenerHandler;
    protected _store: ListenerStore;
    protected context: any;

    constructor(eventDetails: IListenerBasis, store: ListenerStore, context: IPluginArch) {
        super();
        const { name, type, handler, rule, id } = eventDetails;
        this._name = name;
        this._type = type;
        this._rule = rule;
        this._store = store;
        this._id = id || Math.random().toString(36).substring(2, 9);
        this._handler = handler;
        this.context = context;
    }

    get name(): string { return this._name; }
    get type(): string { return this._type; }
    get id(): string { return this._id; }
    get rule(): IListenerRule { return this._rule || {}; }

    public release(payload: IPayload): IPayload {
        return this._handler.call(this, payload, this.context) || payload;
    }

    public remove(): void {
        this._store.remove(this);
    }
}