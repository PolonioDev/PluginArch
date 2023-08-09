import type IEachHandler from './IEachHandler';
import type IListenerBasis from './IListenerBasis';
import type IListenerList from './IListenerList';
import type IListener from './IListener';
import type IListenerType from './IListenerType';

export default abstract class IListenerStore {
	protected abstract events: IListenerList;

	public abstract add(eventDetails: IListenerBasis): IListener;
	public abstract remove(event: IListener): void;
	public abstract removeAll(): void;
	public abstract each(event_name: string, handle: IEachHandler, type?: IListenerType): void;
	public abstract search(event_name: string, id: string, type?: IListenerType): IListener | undefined;
	public abstract gets(event_name: string, type: IListenerType): IListener[];
	public abstract get(event_name: string, type: IListenerType, id: string): IListener | undefined;
}
