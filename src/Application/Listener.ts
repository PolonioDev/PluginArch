// Domain
import type IListenerBasis from '@Domain/IListenerBasis';
import type IListenerHandler from '@Domain/IListenerHandler';
import type IListenerRule from '@Domain/IListenerRule';
import IListener from '@Domain/IListener';
import type IPayload from '@Domain/IPayload';
import type IPluginArch from '@Domain/IPluginArch';
// Application
import type ListenerStore from '@Application/ListenerStore';

export default class Listener extends IListener {
	static createID(size=1): string {
		let id = '';
		for(let i=0; i<size; i++) id += Math.random().toString(36).substring(2, 9);
		return id;
	}

	protected _name: string;
	protected _type: string;
	protected _id: string;
	protected _rule?: IListenerRule;
	protected _handler: IListenerHandler;
	protected _store: ListenerStore;
	protected context;

	constructor(eventDetails: IListenerBasis, store: ListenerStore, context: IPluginArch) {
		super();
		const { name, type, handler, rule, id } = eventDetails;
		this._name = name;
		this._type = type;
		this._rule = rule;
		this._store = store;
		this._id = id ?? Listener.createID(4);
		this._handler = handler;
		this.context = context;
	}

	get name(): string {
		return this._name;
	}

	get type(): string {
		return this._type;
	}

	get id(): string {
		return this._id;
	}

	get rule(): IListenerRule {
		return this._rule ?? {};
	}

	get handler(): IListenerHandler {
		return this._handler;
	}

	public release(payload: IPayload): IPayload {
		if(!this.canExecute(payload)) return payload;
		const response = this._handler(payload, this.context, this) ?? payload;
		if(this.type === 'once') this.remove();
		return response;
	}

	public remove(): void {
		this._store.remove(this);
	} 

	protected canExecute(payload: IPayload): boolean {
		let can = true;
		if(this.rule){
			Object.keys(this.rule).forEach(rule => {
				const expect = this.rule[ rule ] as unknown;
				if(payload[ rule ] !== expect){
					can = false;
				}
			});
		}

		return can;
	}
}
