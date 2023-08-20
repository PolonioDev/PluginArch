import type IEventOnQueue from './IEventOnQueue';
type IEventQueueStore = Record<string, {
    isBusy: boolean,
    content: IEventOnQueue[],
    channel: IEventOnQueue[]
}>;
export default IEventQueueStore;
