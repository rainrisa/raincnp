export interface IPlayer {
  name: string;
  skills: number[];
  statistics: {
    kill: {
      generalMatch: number;
      clanWar: number;
      rfaMatchday: number;
    };
    death: {
      generalMatch: number;
      clanWar: number;
      rfaMatchday: number;
    };
  };
  grade: string;
  health?: number;
  totalExp: number;
  clan?: string;
  nation: string;
}

export interface ITeam {
  name: string;
  type: "clan" | "nation";
  totalMatch: number;
  founder?: string;
  win: number;
  lose: number;
}

export interface IGrade {
  name: string;
  expNeeded: number;
}

export interface IBattle {
  type: "regularMatch" | "clanWar" | "rfaMatchday";
  whiteTeam: {
    teamName: string;
    score: number;
    players: IBattlePlayer[];
  };
  blackTeam: {
    teamName: string;
    score: number;
    players: IBattlePlayer[];
  };
}

export interface IBattlePlayer {
  name: string;
  clan?: string;
  nation: string;
  kill: number;
  death: number;
  health?: number;
}

export interface IBattleFighter {
  self: IPlayer;
  team: IPlayer[];
}

export type IMatchType = "regularMatch" | "clanWar" | "rfaMatchday";
