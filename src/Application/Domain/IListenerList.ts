import IListener from './IListener';

export default interface IListenerList {
    [type: string]: {
        [name: string]: {
            [id: string]: IListener;
        };
    };
}