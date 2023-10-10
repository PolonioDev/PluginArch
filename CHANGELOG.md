# CHANGELOG
## Plugins Update [v0.0.4]:
- Plugins now support internal events by channel 
  to modify the default behavior of PluginArch functions.
- Plugins now support object or class-based layouts and
  can access their own members to handle their data in
  isolation from the PluginArch based classes.
- Methods must now be created to listen for events using
  the event type as prefix and the "Handler" suffix in his name.
- Now it is possible to initialize a plugin by using the "init" function in it.

## Simple Utility Update [v0.0.5]: 
- It is now possible to import listeners from another PluginArch class using the "import" function.
  This feature allows events from one  class to be handled by listeners from another in a simple way.
- It is now possible to relay events from some PluginArc-based class to another using the "relay" method .
- It's now possible use rules to filter requests to listen in onRequest Method and rules works in onChannel Method too.