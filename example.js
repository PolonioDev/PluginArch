import PluginArch from './dist/main.mjs';
// import PluginArch from 'pluginarch';


class MyCore extends PluginArch {
    constructor(plugin) {
        super();

        // Load new Plugin
        this.use(plugin);

        // Using MyCore Basic Logic
        this.log('Core is running...');
    }

    // MyCore Basic Logic
    log(message) {
        const parsedMessage = this.emit('log', { message }).message;
        console.log(parsedMessage);
    }
}

// My Custom Plugin
const plugin = {
    name: 'MyPlugin',
    description: 'Prints to console messages always in uppercase.',
    author: 'MyName',

    on: {
        // My listener to modify all "log" events
        log: ({ payload: { message } }) => {
            // Changing the payload
            return { message: message.toUpperCase() };
        }
    }
};

const core = new MyCore(plugin);