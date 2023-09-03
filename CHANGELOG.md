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