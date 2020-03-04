import { BackgroundController } from "../../windows/background/background-controller";
import SummaryService from "./summary-service";
/**
 * Game Event Provider service
 * This will listen to events from the game provided by
 * Overwolf's Game Events Provider
 */

export class GepService {

  private static readonly REQUIRED_FEATURES: string[] = ['kill', "death", "map", "phase", "team", "me", "rank", "killer", "revived", "match"];
  private static readonly REGISTER_RETRY_TIMEOUT: number = 10000;

  private static _instance: GepService = new GepService();

  protected constructor() {
  }

  static get instance(): GepService {
    return GepService._instance;
  }

  public registerToGEP() {
    // set the features we are interested in receiving
    overwolf.games.events.setRequiredFeatures(GepService.REQUIRED_FEATURES,
      this._registerToGepCallback.bind(this));
  }

  private _registerToGepCallback(response: any) {
    if (response.status === 'error') {
      setTimeout(this.registerToGEP.bind(this), GepService.REGISTER_RETRY_TIMEOUT);
    } else if (response.status === 'success') {
      //console.log("Events started")
      overwolf.games.events.onNewEvents.removeListener(this._handleGameEvent.bind(this));
      overwolf.games.events.onNewEvents.addListener(this._handleGameEvent.bind(this));
      overwolf.games.events.onInfoUpdates2.removeListener(this._handleGameInfo.bind(this));
      overwolf.games.events.onInfoUpdates2.addListener(this._handleGameInfo.bind(this));
    }
  }

  private async _handleGameEvent(eventsInfo: any) {
    for (let eventData of eventsInfo.events) {
      let data = JSON.parse(JSON.stringify(eventData))
      // Jump 
      let eventName = data.name;
      switch (eventName) {
        case "kill":
          //SummaryService.updateSettings("kill", 1)
          break;
        case "knockout":
          SummaryService.updateSettings("knockout", 1)
          break;
        case "headshot":
          SummaryService.updateSettings("headshot", 1)
          break;
        case "damage_dealt":
          console.log(data.data)
          // Damage delt event
          break;
        case "revived":
          SummaryService.updateSettings("revived", 1)
          break;
        case "death":
          SummaryService.updateSettings("death", true)
          break;
        case "knockedout":
          SummaryService.updateSettings("knockedout", 1)
          break;
        case "killer":
          data = JSON.parse(data.data);
          SummaryService.updateSettings("killedBy", data.killer_name)
          break;
        case "matchStart":
          //console.log("Match is starting!")
          break;
        case "matchEnd":
          //console.log("Match ended!")
          break;
        case "matchSummary":
          //SummaryService.updateSettings("ended", 0)
          //console.log("Match summary!")
          break;
      }
    }
  }

  private async _handleGameInfo(gameInfo: any) {
    let data = JSON.parse(JSON.stringify(gameInfo))
    // Phase
    if (data.feature === "phase") {
      let phase = data.info.game_info.phase;
      switch (phase) {
        case "lobby":
          //console.log("You are in lobby phase");
          break;
        case "loading_screen":
          //console.log("You are loading in phase");
          break;
        case "aircraft":
          //console.log("Aircraft is in the air phase");
          break;
        case "airfield":
          //console.log("You are in the airfield in phase");
          break;
        case "freefly":
          //console.log("Jump jump jump in phase");
          break;
        case "landed":
          //console.log("You have landed go for an fight in phase");
          break;
      }
      // Me
    } else if (data.feature === "me") {
      let me = data.info.me
      if (me.name) {
        //console.log(me.name + " welcome to helmetStats!")
      } else if (me.view) {
        SummaryService.updateSettings("view", me.view)
      } else if (me.movement) {
        ////console.log("Your movement is: " + me.movement)
      }
      // Match
    } else if (data.feature === "match") {
      if (data.info.match_info.match_id) {
        SummaryService.updateSettings("matchID", data.info.match_info.match_id)
      }

      if (data.info.match_info.mode) {
        SummaryService.updateSettings("mode", data.info.match_info.mode)
      }
      // Kill
    } else if (data.feature === "kill") {
      let kill = data.info.match_info;
      if (kill.headshots) {
        //console.log("Headshots:" + kill.headshots)
      } else if (kill.total_damage_dealt) {
        //console.log("Damage delt:" + kill.total_damage_dealt)
        SummaryService.updateSettings("damageDealt", kill.total_damage_dealt)
      } else if (kill.max_kill_distance) {
        //console.log("Max kill distance: " + kill.max_kill_distance)
      } else if (kill.kills) {
        SummaryService.updateSettings("kill", kill.kills)
      }
      // Rank
    } else if (data.feature === "rank") {
      let rank = data.info.match_info
      if (rank.me) {
        SummaryService.updateSettings("rank", rank.me)
      }
      if (rank.total) {
        SummaryService.updateSettings("total", rank.total)
      }
      // Map
    } else if (data.feature === "map") {
      let map = data.info.match_info.map;
      SummaryService.updateSettings("map", map)
      // Team
    } else if (data.feature === "team") {
      let team = JSON.parse(data.info.match_info.nicknames)
      SummaryService.updateSettings("team", team)
    }
  }
}

