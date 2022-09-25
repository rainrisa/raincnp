export const PlayerSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Player Validation",
      required: ["name", "skills", "statistics", "grade", "totalExp", "nation"],
      properties: {
        name: {
          bsonType: "string",
          description: "'name' must be a string and is required",
        },
        skills: {
          bsonType: "array",
          description: "'skills' must be an array and is required",
          minItems: 3,
          maxItems: 3,
          items: {
            bsonType: "int",
            minimum: 0,
            maximum: 100,
            description: "'skill' must be an integer in [ 0, 100 ] and is required",
          },
        },
        statistics: {
          bsonType: "object",
          required: ["kill", "death"],
          properties: {
            kill: {
              bsonType: "object",
              description: "'kill' must be an object and is required",
              required: ["generalMatch", "clanWar", "rfaMatchday"],
              properties: {
                generalMatch: {
                  bsonType: "int",
                  description: "'generalMatch' must be an integer and is required",
                },
                clanWar: {
                  bsonType: "int",
                  description: "'clanWar' must be an integer and is required",
                },
                rfaMatchday: {
                  bsonType: "int",
                  description: "'rfaMatchday' must be an integer and is required",
                },
              },
            },
            death: {
              bsonType: "object",
              description: "'death' must be an object and is required",
              required: ["generalMatch", "clanWar", "rfaMatchday"],
              properties: {
                generalMatch: {
                  bsonType: "int",
                  description: "'generalMatch' must be an integer and is required",
                },
                clanWar: {
                  bsonType: "int",
                  description: "'clanWar' must be an integer and is required",
                },
                rfaMatchday: {
                  bsonType: "int",
                  description: "'rfaMatchday' must be an integer and is required",
                },
              },
            },
          },
        },
        grade: {
          bsonType: "string",
          description: "'grade' must be a string and is required",
        },
        totalExp: {
          bsonType: "int",
          description: "'totalExp' must be an integer and is required",
        },
        clan: {
          bsonType: "string",
          description: "'clan' must be a string",
        },
        nation: {
          bsonType: "string",
          description: "'nation' must be a string and is required",
        },
      },
    },
  },
};

export const TeamSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Team Validation",
      required: ["name", "type", "totalMatch", "win", "lose"],
      properties: {
        name: {
          bsonType: "string",
          description: "'name' must be a string and is required",
        },
        type: {
          bsonType: "string",
          enum: ["clan", "nation"],
          description: "'type' must be string `clan` or `nation` and is required",
        },
        totalMatch: {
          bsonType: "int",
          description: "'totalMatch' must be an integer and is required",
        },
        founder: {
          bsonType: "string",
          description: "'founder' must be a string",
        },
        win: {
          bsonType: "int",
          description: "'win' must be an integer and is required",
        },
        lose: {
          bsonType: "int",
          description: "'lose' must be an integer and is required",
        },
      },
    },
  },
};

export const GradeSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Grade Validation",
      required: ["name", "expNeeded"],
      properties: {
        name: {
          bsonType: "string",
          description: "'name' must be a string and is required",
        },
        expNeeded: {
          bsonType: "int",
          description: "'expNeeded' must be an integer and is required",
        },
      },
    },
  },
};

export const BattleSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Battle Validation",
      required: ["whiteTeam", "blackTeam"],
      properties: {
        whiteTeam: {
          bsonType: "object",
          description: "'whiteTeam' must be an object and is required",
          required: ["score", "players"],
          properties: {
            score: {
              bsonType: "int",
              description: "'score' must be an integer and is required",
            },
            players: {
              bsonType: "array",
              description: "'players' must be an array and is required",
              items: {
                bsonType: "object",
                required: ["name", "nation", "kill", "death"],
                properties: {
                  name: {
                    bsonType: "string",
                    description: "'name' must be a string and is required",
                  },
                  clan: {
                    bsonType: "string",
                    description: "'clan' must be a string",
                  },
                  nation: {
                    bsonType: "string",
                    description: "'nation' must be a string and is required",
                  },
                  kill: {
                    bsonType: "int",
                    description: "'kill' must be an integer and is required",
                  },
                  death: {
                    bsonType: "int",
                    description: "'death' must be an integer and is required",
                  },
                  health: {
                    bsonType: "int",
                    description: "'health' must be an integer",
                  },
                },
              },
            },
          },
        },
        blackTeam: {
          bsonType: "object",
          description: "'blackTeam' must be an object and is required",
          required: ["score", "players"],
          properties: {
            score: {
              bsonType: "int",
              description: "'score' must be an integer and is required",
            },
            players: {
              bsonType: "array",
              description: "'players' must be an array and is required",
              items: {
                bsonType: "object",
                required: ["name", "nation", "kill", "death"],
                properties: {
                  name: {
                    bsonType: "string",
                    description: "'name' must be a string and is required",
                  },
                  clan: {
                    bsonType: "string",
                    description: "'clan' must be a string",
                  },
                  nation: {
                    bsonType: "string",
                    description: "'nation' must be a string and is required",
                  },
                  kill: {
                    bsonType: "int",
                    description: "'kill' must be an integer and is required",
                  },
                  death: {
                    bsonType: "int",
                    description: "'death' must be an integer and is required",
                  },
                  health: {
                    bsonType: "int",
                    description: "'health' must be an integer",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
