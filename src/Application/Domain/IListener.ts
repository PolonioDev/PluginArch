import type IListenerHandler from './IListenerHandler';
import type IListenerRule from './IListenerRule';
import type IListenerStore from './IListenerStore';
import type IPayload from './IPayload';

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
	abstract get handler(): IListenerHandler;
	public abstract release(payload: IPayload): IPayload;
	public abstract remove(): void;
}
