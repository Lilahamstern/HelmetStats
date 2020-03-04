export  class Seasons {
  id!: string;
  isCurrentSeason!: boolean;

  constructor(id: string, isCurrentSeason: boolean) {
    this.id = id,
      this.isCurrentSeason = isCurrentSeason;
  }
}