/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'mocha'; 
import { expect } from 'chai';
import PluginArch from 'index';
import sinon from 'sinon';
import type IMiddleware from '@Domain/IMiddleware';
import type IListenerHandler from '@Domain/IListenerHandler';

class Logger extends PluginArch {
  constructor(plugin: IMiddleware){ 
    super();
    this.use(plugin);
  }

  get throwEvent() {
    return this.emit;
  }

  get onReq() {
    return this.onRequest;
  }

  write(message: string): string {
    const messageToWrite = this.emit('write', { message }).message as string;
    return messageToWrite;
  }
}
let middlewareWriteLaunch = false;
let middlewareAnyLaunch = false;
const plugin: IMiddleware = {
  name: 'MyTestingPlugin',
  description: 'Plugin for test funcionality',
  author: 'PolonioDev',
  on: {
    write({ message }) {
      return middlewareWriteLaunch ? { message: message as string + ' > intercept' } : undefined;
    },
    any({ message }){
      return middlewareAnyLaunch ? {
         message: message as string + ' > interceptAny'
      } : undefined;
    }
  }
};

const log = new Logger(plugin);

describe('PluginArch [./src/index.ts]', () => {

  it('on', ()=> {
    let callback = sinon.spy();
    let listener = log.on('test01', callback as IListenerHandler);
    log.throwEvent('test01');
    log.throwEvent('test01');
    expect(callback.calledTwice, 'Multi Listen').to.be.true;
    listener.remove();

    callback = sinon.spy(()=> ({ sucess: true }));
    listener = log.on('test02', callback as IListenerHandler, { pass: true });
    const { sucess } = log.throwEvent('test02', { pass: true });
    const { fallback } = log.throwEvent('test02', { fallback: true });
    expect(callback.calledOnce, 'Filtering Rule').to.be.true;
    listener.remove();
    expect(sucess, 'Listener modifications').to.be.true;
    expect(fallback, 'Listener without modifications').to.be.true;
  });

  it('once', ()=> {
    let callback = sinon.spy();
    log.once('test03', callback as IListenerHandler);
    log.throwEvent('test03');
    log.throwEvent('test03');
    expect(callback.calledOnce, 'Single listener call').to.be.true;

    callback = sinon.spy(()=> ({ sucess: true }));
    log.once('test04', callback as IListenerHandler, { pass: true });
    const { fallback } = log.throwEvent('test04', { fallback: true });
    const { sucess } = log.throwEvent('test04', { pass: true });
    expect(callback.calledOnce, 'Filtering Rule').to.be.true;
    expect(sucess, 'Listener modifications').to.be.true;
    expect(fallback, 'Listener without modifications').to.be.true;
  });

  it('request & response', async () => {
    const onResponseRecived = sinon.spy();
    log.onReq((id, content, context) => {
      content.message = content.message.toUpperCase();
      context.response(id, content).then(onResponseRecived);
    });

    const content = await log.request({ message: 'test' });
    expect(content).to.have.key('message');
    expect(content.message).to.be.equals('TEST');
    expect(
      onResponseRecived.calledOnce,
       'response: Promise<void> must be resolved when request recive the response'
    ).to.be.true;
  });

  it('emit', () => {
    const callback = sinon.spy((payload) => {
      payload.status = 'parsed'
    });
    const listener = log.on('test05', callback, { status: 'not parsed' });
    const { status } = log.throwEvent('test05', { status: 'not parsed' });
    expect(status).to.be.equals('parsed');
    const { status: statusWithoutModifications } = log.throwEvent('test05', { status: 'noParse' });
    expect(statusWithoutModifications).to.be.equals('noParse');
    const secondCallback = sinon.spy();
    const secondListener = log.on('test05', secondCallback);
    log.throwEvent('test05', { status: 'not parsed' }, listener.id);
    expect(callback.calledTwice).to.be.true;
    expect(secondCallback.notCalled).to.be.true;
    listener.remove();
    secondListener.remove();
    log.throwEvent('test05', { status: 'not parsed' });
    expect(callback.calledTwice, 'Should not execute deleted listeners').to.be.true;
  });

  it('interceptAny > intercept > on > once', () => {
    middlewareAnyLaunch = true;
    middlewareWriteLaunch = true;
    log.once('any', (payload) => {
      payload.message = payload.message as string + ' > onceAny'; 
    });
    log.on('any', (payload) => {
      payload.message = payload.message as string + ' > onAny'; 
    });
    log.once('write', (payload) => {
      payload.message = payload.message as string + ' > once'; 
    });
    log.on('write', (payload) => {
      payload.message = payload.message as string + ' > on'; 
    });
    const logContent = log.write('init');
    expect(logContent).to.be.equals('init > interceptAny > onAny > onceAny > intercept > on > once');
  });
});