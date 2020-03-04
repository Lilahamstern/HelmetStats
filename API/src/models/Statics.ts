export class PlayerStats {
  id!: string;
  seasonID?: string;
  solo!: Statics
  soloFPP!: Statics
  duo!: Statics
  duoFPP!: Statics
  squad!: Statics
  squadFPP!: Statics

  constructor(id: string, solo: Statics, soloFPP: Statics, duo: Statics, duoFPP: Statics, squad: Statics, squadFPP: Statics, seasonID?: string) {
    this.id = id
    this.solo = solo
    this.soloFPP = soloFPP
    this.duo = duo
    this.duoFPP = duoFPP
    this.squad = squad
    this.squadFPP = squadFPP
    this.seasonID = seasonID
  }
}

export class Statics {
  assists!: Number;
  bestRankPoint!: Number;
  boosts!: Number;
  dBNOs!: Number;
  dailyKills!: Number;
  damageDealt!: Number;
  days!: Number;
  dailyWins!: Number;
  headshotKills!: Number;
  heals!: Number;
  killPoints!: Number;
  kills!: Number;
  longestKill!: Number;
  longestTimeSurvived!: Number;
  losses!: Number;
  maxKillStreaks!: Number;
  mostSurvivalTime!: Number;
  rankPoints!: Number;
  //rankPointsTitle!: String;
  revives!: Number;
  rideDistance!: Number;
  roadKills!: Number;
  roundMostKills!: Number;
  roundsPlayed!: Number;
  suicides!: Number;
  swimDistance!: Number;
  teamKills!: Number;
  timeSurvived!: Number;
  top1Numbers!: Number;
  vehicleDestroys!: Number;
  walkDistance!: Number;
  weaponsAcquired!: Number;
  weeklyKills!: Number;
  weeklyWins!: Number;
  winPoints!: Number;
  wins!: Number

  constructor(data: any) {
    this.assists = data.assists;
    this.bestRankPoint = data.bestRankPoint;
    this.boosts = data.boosts;
    this.dBNOs = data.dBNOs;
    this.dailyKills = data.dailyKills;
    this.dailyWins = data.dailyWins;
    this.damageDealt = data.damageDealt;
    this.days = data.days;
    this.headshotKills = data.headshotKills;
    this.heals = data.heals;
    this.killPoints = data.killPoints;
    this.kills = data.kills;
    this.longestKill = data.longestKill;
    this.longestTimeSurvived = data.longestTimeSurvived;
    this.losses = data.losses;
    this.maxKillStreaks = data.maxKillStreaks;
    this.mostSurvivalTime = data.mostSurvivalTime;
    this.rankPoints = data.rankPoints;
    //this.rankPointsTitle = data.rankPointsTitle;
    this.revives = data.revives;
    this.rideDistance = data.rideDistance;
    this.roadKills = data.roadKills;
    this.roundMostKills = data.roundMostKills;
    this.roundsPlayed = data.roundsPlayed;
    this.suicides = data.suicides;
    this.swimDistance = data.swimDistance;
    this.teamKills = data.teamKills;
    this.timeSurvived = data.timeSurvived;
    this.top1Numbers = data.top1Numbers;
    this.vehicleDestroys = data.vehicleDestroys;
    this.walkDistance = data.walkDistance;
    this.weaponsAcquired = data.weaponsAcquired;
    this.weeklyKills = data.weeklyKills;
    this.weeklyWins = data.weeklyWins;
    this.winPoints = data.winPoints;
    this.wins = data.wins;

  }
}
