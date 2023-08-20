import type IPayload from './IPayload';

interface IEventOnQueue {
  payload: IPayload,
  event: string,
  id?: string
}

export default IEventOnQueue;