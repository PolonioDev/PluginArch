import type IListenerHandler from './IListenerHandler';

type IPlugin = {
	[key: string]: any;
	name: string;
	// Version: string;
	description: string;
	author: string;
	// License: string;
	// repository?: string;
	// bugs?: string;
	// homepage?: string;

	// requiredAccess: string[];
	init?: () => void;
}
export default IPlugin;
