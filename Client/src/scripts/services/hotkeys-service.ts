import { HotkeysIds } from '../constants/hotkeys-ids';
import { resolve, reject } from 'bluebird';

export class HotkeysService {
  private static _instance: HotkeysService = new HotkeysService();

  protected constructor() {
  }

  static get instance(): HotkeysService {
    return HotkeysService._instance;
  }

  /**
   * get a hotkey combination by hotkey id
   * @param hotkeyId
   * @param callback
   * @private
   */
  private _getHotkey(hotkeyId: string, callback: (result: any) => void) {
    let that = this;
    overwolf.settings.getHotKey(hotkeyId, function (result: any) {
      if (!result || result.status === "error" || !result.hotkey) {
        setTimeout(function () {
          that._getHotkey(hotkeyId, callback);
        }, 2000);
      } else {
        callback(result.hotkey);
      }
    });
  }

  /**
   * set custom action for a hotkey id
   * @param hotkeyId
   * @param action
   * @private
   */
  private _setHotkey(hotkeyId: string, action: () => void) {
    overwolf.settings.registerHotKey(hotkeyId, function (result) {
      if (result.status === 'success') {
        action();
      } else {
        console.error(`[HOTKEYS SERVICE] failed to register hotkey ${hotkeyId}`);
      }
    });
  }

  public getTakeScreenshotHotkey(): Promise<string> {
    let that = this;
    return new Promise((resolve, reject) => {
      that._getHotkey(HotkeysIds.TAKE_SCREENSHOT, resolve);
    });
  }

  public getOpenMainWindowHotkey(): Promise<string> {
    let that = this;
    return new Promise((resolve, reject) => {
      that._getHotkey(HotkeysIds.OPEN_MAIN_WINDOW, resolve)
    })
  }

  public setOpenMainWindowHotkey(action: () => any) {
    this._setHotkey(HotkeysIds.OPEN_MAIN_WINDOW, action)
  }

  public getToggleSummaryHotkey(action: () => any) {
    let that = this;
    return new Promise((resolve, reject) => {
      that._getHotkey(HotkeysIds.TOGGLE_SUMMARY, resolve)
    })
  }

  public setToggleSummaryHotkey(action: () => any) {
    this._setHotkey(HotkeysIds.TOGGLE_SUMMARY, action)
  }

  public addHotkeyChangeListener(listener: (payload?: any) => void) {
    overwolf.settings.OnHotKeyChanged.addListener(listener);
  }

}


