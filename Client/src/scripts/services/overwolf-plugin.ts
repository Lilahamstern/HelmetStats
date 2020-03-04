export default class OverwolfPlugin {

  private _pluginInstance: any = null;
  private _extraObjectName: string;
  private _addNameToObject: boolean;

  constructor(extraObjectNameInManifest: string, addNameToObject: boolean) {
    this._extraObjectName = extraObjectNameInManifest;
    this._addNameToObject = addNameToObject;
  }

  public initialize(callback: any) {
    return this._initialize(callback);
  }

  public initialized() {
    return this._pluginInstance != null;
  };

  public get() {
    return this._pluginInstance;
  };

  // privates
  private _initialize(callback: any) {
    var proxy: any = null;

    try {
      proxy = overwolf.extensions.current.getExtraObject;
    } catch (e) {
      console.error(
        "overwolf.extensions.current.getExtraObject doesn't exist!");
      return callback(false);
    }

    proxy(this._extraObjectName, ((res: any) => {
      if (res.status != "success") {
        console.error(
          "failed to create " + this._extraObjectName + " object: " + res);
        return callback(false);
      }

      this._pluginInstance = res.object;

      if (this._addNameToObject) {
        this._pluginInstance._PluginName_ = this._extraObjectName;
      }

      return callback(true);
    }))
  }
}
