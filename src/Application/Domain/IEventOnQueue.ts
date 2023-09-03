import type IPayload from './IPayload';

type IEventOnQueue = {
  payload: IPayload,
  event: string,
  id?: string
}

export default IEventOnQueue;