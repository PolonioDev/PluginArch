// Domain
import type IEachHandler from '@Domain/IEachHandler';
import type IListenerBasis from '@Domain/IListenerBasis';
import type IListenerList from '@Domain/IListenerList';
import IListenerStore from '@Domain/IListenerStore';
import type IListenerType from '@Domain/IListenerType';
import type IListener from '@Domain/IListener';
// Application
import Listener from '@Application/Listener';
import type IPluginArch from '@Domain/IPluginArch';

export default class ListenerStore extends IListenerStore {
	protected events: IListenerList = {};
	protected context: IPluginArch & any;

	constructor(context: IPluginArch) {
		super();
		this.context = context;
	}

	public add(eventDetails: IListenerBasis): Listener {
		const event = new Listener(eventDetails, this, this.context as IPluginArch);
		const { name, type, id } = event;

		// Path Verification
		if (!this.events[ type ]) {
			this.events[ type ] = {};
		}

		if (!this.events[ type ][ name ]) {
			this.events[ type ][ name ] = {};
		}

		// Save the event
		this.events[ type ][ name ][ id ] = event;
		return event;
	}

	public remove(event: IListener): void {
		const { name, type, id } = event;
		delete this.events[ type ][ name ][ id ];
	}

	public removeAll(): void {
		this.events = {};
	}

	public each(event_name: string, handle: IEachHandler, type?: IListenerType): void {
		if (type) {
			this.gets(event_name, type).forEach(event => {
				if (handle(event)) {
					this.remove(event);
				}
			});
		} else {
			this.each(event_name, handle, 'on');
			this.each(event_name, handle, 'once');
		}
	}

	public search(event_name: string, id: string, type?: IListenerType): IListener | undefined {
		let found: IListener | undefined;
		if (type) {
			found = this.get(event_name, type, id);
		} else {
			found = this.search(event_name, id, 'on');
			found = found ?? this.search(event_name, id, 'once');
		}

		return found;
	}

	public gets(event_name: string, type: IListenerType): IListener[] {
		let values: IListener[] = [];
		if (this.events[ type ]?.[ event_name ]) {
			values = Object.keys(this.events[ type ][ event_name ]).map(id => this.events[ type ][ event_name ][ id ]);
		}

		return values;
	}

	public get(event_name: string, type: IListenerType, id: string): IListener | undefined {
		if (!this.events[ type ]?.[ event_name ]) {
			return undefined;
		}

		return this.events[ type ][ event_name ][ id ];
	}
}
