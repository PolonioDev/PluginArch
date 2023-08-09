import type IListenerHandler from './IListenerHandler';

type IMiddleware = {
	name: string;
	// Version: string;
	description: string;
	author: string;
	// License: string;
	// repository?: string;
	// bugs?: string;
	// homepage?: string;

	// requiredAccess: string[];
	// init: () => void;

	on?: Record<string, IListenerHandler>;

	once?: Record<string, IListenerHandler>;

	onChannel?: Record<string, IListenerHandler>;
};
export default IMiddleware;
