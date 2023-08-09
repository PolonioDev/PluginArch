import type IListenerHandler from './IListenerHandler';
import type IListenerRule from './IListenerRule';
import type IListenerType from './IListenerType';

type IListenerBasis = {
	id?: string;
	name: string;
	type: IListenerType;
	handler: IListenerHandler;
	rule?: IListenerRule;
};
export default IListenerBasis;
