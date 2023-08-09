# PluginArch [WIP v0.0.1]
Plugin architecture core powered by events for any apps.

## Quickstart
```sh
npm install pluginarch
```

### Let's try
```js
import PluginArch from 'pluginarch';


class Logger extends PluginArch {
    constructor(plugin) {
        super();

        // Load new Plugin
        this.use(plugin);

        // Using Logger Basic Logic
        this.write('Core is running...');
    }

    // Logger method to write in console
    write(message) {
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
        log: ({message}) => {
            // We modify the payload
            return { message: message.toUpperCase() };
        }
    }
};

const log = new Logger(plugin);

```

#### OutPut
```
    CORE IS RUNNING...
```