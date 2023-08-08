import IPluginArch from '@Domain/IPluginArch';
import IQueueEvent from '@Domain/IQueueEvent';
import IPayload from '@Domain/IPayload';

export default abstract class EventQueue extends IPluginArch {
    protected onDequeue: boolean = false;
    protected queue: IQueueEvent = [];

    enqueue(event: string, payload: IPayload): void {
        this.queue.push([event, payload]);
    }

    dequeue(): void {
        if (this.onDequeue)
            return;

        this.onDequeue = true;
        this.queue.forEach(([event, paylaod]) => {
            this.emit(event, paylaod);
        })
        this.queue = [];
        this.onDequeue = false;
    }
}