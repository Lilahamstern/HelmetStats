export class Player {
  name!: string;
  id!: string;
  matches!: Matches[];

  constructor(playerData: any, matches: Matches[]) {
    this.name = playerData.attributes.name;
    this.id = playerData.id;
    this.matches = matches;
  }

}

export class Matches {
  matchID!: string;

  constructor(matchID: any) {
    this.matchID = matchID
  }
}
