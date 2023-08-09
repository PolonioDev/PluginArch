import type IListener from './IListener';

type IEachHandler = (event: IListener) => boolean | void;
export default IEachHandler;
