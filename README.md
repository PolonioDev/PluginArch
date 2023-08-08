# PluginArch [WIP v0.0.1]
Plugin architecture core powered by events for any apps.

## Quickstart
```sh
npm install pluginarch
```

### Let's try
This is an example of how we can modify or extend functionality to a class that uses the plugin architecture. In its core we can define its basic functions such as the "log" function, in this example, which is only responsible for printing on the screen, but we can also use plugins to change the default behavior, in this example the plugin change the behavior in core when printing to screen so that it always prints messages in upper case.
```js
import PluginArch from 'pluginarch';


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
        const parsedMessage = this.emit('log', {message}).message;
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
        log: ({payload: {message}}) => {
            // Changing the payload
            return {message: message.toUpperCase()};
        }
    }
};

const core = new MyCore(plugin);

```

#### OutPut
```
    CORE IS RUNNING...
```