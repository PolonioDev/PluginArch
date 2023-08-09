import type IListener from './IListener';
import IListenerType from './IListenerType';

type IListenerList = Record<string, Record<string, Record<string, IListener>>>;
export default IListenerList;
