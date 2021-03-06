import SlippiGame from "@slippi/slippi-js";
import { GameDetails } from "lib/readFile";

import { InitialStateType } from "./types";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  ADD_GAME = "ADD_GAME",
  SET_ERROR = "SET_ERROR",
  ADD_FILE = "ADD_FILE",
  REMOVE_FILE = "REMOVE_FILE",
  CLEAR_ALL = "CLEAR_ALL",
}

type ActionPayload = {
  [Types.ADD_GAME]: {
    filename: string;
    game: SlippiGame;
    details: GameDetails;
  };
  [Types.SET_ERROR]: {
    filename: string;
    error: any;
  };
  [Types.ADD_FILE]: {
    filename: string;
  };
  [Types.REMOVE_FILE]: {
    filename: string;
  };
  [Types.CLEAR_ALL]: never;
};

export type ReducerActions = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>];

export const reducer = (state: InitialStateType, action: ReducerActions) => {
  switch (action.type) {
    case Types.ADD_GAME: {
      const { filename, details } = action.payload;
      const files = state.files;
      const fileToReplace = files.findIndex((f) => f.filename === filename);
      if (fileToReplace !== -1) {
        files[fileToReplace].details = details;
        files[fileToReplace].loading = false;
      }
      return {
        ...state,
        files,
      };
    }
    case Types.SET_ERROR: {
      const { filename, error } = action.payload;
      const files = state.files;
      const fileToReplace = files.findIndex((f) => f.filename === filename);
      if (fileToReplace !== -1) {
        files[fileToReplace].error = error;
        files[fileToReplace].loading = false;
      }
      return {
        ...state,
        files,
      };
    }
    case Types.ADD_FILE: {
      const { filename } = action.payload;
      const files = state.files;
      const alreadyExists = Boolean(files.find((f) => f.filename === filename));
      if (!alreadyExists) {
        files.push({
          filename,
          loading: true,
          details: null,
        });
      }
      return {
        ...state,
        files,
      };
    }
    case Types.REMOVE_FILE: {
      const { filename } = action.payload;
      const files = state.files.filter((f) => f.filename !== filename);
      return {
        ...state,
        files,
      };
    }
    case Types.CLEAR_ALL: {
      return {
        ...state,
        files: [],
      };
    }
    default:
      return state;
  }
};
