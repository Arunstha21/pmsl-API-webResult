const express = require("express");
const app = express();
const port = 3001;

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
app.use(bodyParser.json());
const pmslDB = process.env.PMSL_DBURL;
const cors = require('cors')
app.use(cors());

const client = new MongoClient(pmslDB);
const { ObjectId } = require('mongodb');
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.get("/gesData", async (req, res) => {
  try {
    const event = await client.db("briskFlowPmslDB").collection("events").find({}).toArray();
    const stage = await client.db("briskFlowPmslDB").collection("stages").find({}).toArray();
    const group = await client.db("briskFlowPmslDB").collection("groups").find({}).toArray();
    const matches = await client.db("briskFlowPmslDB").collection("matches").find({}).toArray();
    let matchData = [];
    matches.forEach(match => {
      const data = {
        id: match._id,
        groupId: match.group,
        matchNo: match.matchNumber,
      }
      matchData.push(data);
    })
    const groupDataWithoutSlots = group.map(({ slotList, ...rest }) => rest);
    const gesData = {
      event,
      stage,
      group: groupDataWithoutSlots,
      matchData,
    };
    res.status(200).json({ gesData });

  } catch (err) {
    console.error("Error while fetching data:", err);
    res.status(500).json({ error: "Error while fetching data" });
  }
});

const toHHMMSS = (secs) => {
  const sec_num = parseInt(secs, 10)
  const hours   = Math.floor(sec_num / 3600)
  const minutes = Math.floor(sec_num / 60) % 60
  const seconds = sec_num % 60

  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":")
}

app.post("/overallResults", async (req, res) => {
  try {
    const matchIds = req.body.matchIds;

    const teamStatsColl = client.db("briskFlowPmslDB").collection("teamstats");
    const playerStatsColl = client.db("briskFlowPmslDB").collection("playerstats");
    const matchNoColl = client.db("briskFlowPmslDB").collection("matches");
    const teamColl = client.db("briskFlowPmslDB").collection("teams");
    const playerColl = client.db("briskFlowPmslDB").collection("players");

    let result = {};
    let teamResult = [];
    let playerResult = [];

    const teamStatsMap = {};
    const playerStatsMap = {};

    let totalSurvivalTime = 0;
    let totalDamage = 0;
    let totalKills = 0;

    for (const matchId of matchIds) {
      const match = await matchNoColl.findOne({ _id: new ObjectId(matchId) });

      if (!match) {
        console.error(`Match with ID ${matchId} not found`);
        continue;
      }

      const teamStats = await teamStatsColl.find({ match: new ObjectId(matchId) }).toArray();
      const playerStats = await playerStatsColl.find({ match: new ObjectId(matchId) }).toArray();

      for (const data of teamStats) {
        const teamId = data.team;

        if (!teamStatsMap[teamId]) {
          teamStatsMap[teamId] = {
            matchCount: 0,
            kill: 0,
            damage: 0,
            placePoint: 0,
            totalPoint: 0,
            wwcd: 0,
            lastMatchRank: data.rank
          };
        } else {
          teamStatsMap[teamId].lastMatchRank = data.rank;
        }

        teamStatsMap[teamId].matchCount++;
        teamStatsMap[teamId].wwcd += data.rank === 1 ? 1 : 0;
        teamStatsMap[teamId].kill += data.kill;
        teamStatsMap[teamId].damage += data.damage;
        teamStatsMap[teamId].placePoint += data.placePoint;
        teamStatsMap[teamId].totalPoint += data.totalPoint;
      }

      for (const data of playerStats) {
        const playerId = data.player;

        if (!playerStatsMap[playerId]) {
          playerStatsMap[playerId] = {
            kill: 0,
            damage: 0,
            survivalTime: 0,
            assist: 0,
            heal: 0,
            headshot: 0,
            matchPlayed: 0,
          };
        }

        playerStatsMap[playerId].matchPlayed++;
        playerStatsMap[playerId].kill += data.kill;
        playerStatsMap[playerId].damage += data.damage;
        playerStatsMap[playerId].survivalTime += data.survivalTime;
        playerStatsMap[playerId].assist += data.assist;
        playerStatsMap[playerId].heal += data.heal;
        playerStatsMap[playerId].headshot += data.headshot;
        totalSurvivalTime += data.survivalTime;
        totalDamage += data.damage;
        totalKills += data.kill;
      }
    }

    for (const teamId in teamStatsMap) {
      const teamDoc = await teamColl.findOne({ _id: new ObjectId(teamId) });
      const teamName = teamDoc.name;
      const teamTag = teamDoc.tag;

      teamResult.push({
        team: teamName,
        tag: teamTag,
        kill: teamStatsMap[teamId].kill,
        damage: teamStatsMap[teamId].damage,
        matchCount: teamStatsMap[teamId].matchCount,
        placePoint: teamStatsMap[teamId].placePoint,
        totalPoint: teamStatsMap[teamId].totalPoint,
        lastMatchRank: teamStatsMap[teamId].lastMatchRank,
        wwcd: teamStatsMap[teamId].wwcd
      });
    }

    for (const playerId in playerStatsMap) {
      const playerDoc = await playerColl.findOne({ _id: new ObjectId(playerId) });
      const teamDoc = await teamColl.findOne({ _id: new ObjectId(playerDoc.team) });

      const teamName = teamDoc.name;
      const ign = playerDoc.ign;
      const uId = playerDoc.uId;

      const playerSurvivalTimeRatio = playerStatsMap[playerId].survivalTime / totalSurvivalTime;
      const playerDamageRatio = playerStatsMap[playerId].damage / totalDamage;
      const playerKillRatio = playerStatsMap[playerId].kill / totalKills;

      const MVP = (((playerSurvivalTimeRatio * 0.4) + (playerDamageRatio * 0.4) + (playerKillRatio * 0.2))*100).toFixed(3);
      const survTime = playerStatsMap[playerId].survivalTime/ playerStatsMap[playerId].matchPlayed;
      const avgSurvTime = toHHMMSS(survTime);
      playerResult.push({
        teamName: teamName,
        inGameName: ign,
        uId: uId,
        kill: playerStatsMap[playerId].kill,
        damage: playerStatsMap[playerId].damage,
        matchPlayed: playerStatsMap[playerId].matchPlayed,
        dataSurvTime: survTime,
        survivalTime: avgSurvTime,
        assist: playerStatsMap[playerId].assist,
        heal: playerStatsMap[playerId].heal,
        headshot: playerStatsMap[playerId].headshot,
        mvp: MVP,
      });
    }

    teamResult.sort((a, b) => {
      if (a.totalPoint !== b.totalPoint) {
        return b.totalPoint - a.totalPoint;
      }
      if (a.wwcd !== b.wwcd) {
        return b.wwcd - a.wwcd;
      }

      if (a.placePoint !== b.placePoint) {
        return b.placePoint - a.placePoint;
      }
      if (a.kill !== b.kill) {
        return b.kill - a.kill;
      }

      return a.lastMatchRank - b.lastMatchRank;
    });
    teamResult.forEach((item, index) => {
      item.cRank = index + 1;
    });
    playerResult.sort((a, b) => {
      if (a.mvp !== b.mvp) {
        return b.mvp - a.mvp;
      }
      if (a.kill !== b.kill) {
        return b.kill - a.kill;
      }
      if (a.damage !== b.damage) {
        return b.damage - a.damage;
      }
      return b.dataSurvTime - a.dataSurvTime;
    });
    playerResult.forEach((item, index) => {
      item.cRank = index + 1;
    });

    result = {
      teamResult,
      playerResult
    };

    res.status(200).json({ result });
  } catch (err) {
    console.error("Error while fetching data:", err);
    res.status(500).json({ error: "Error while fetching data" });
  }
});

app.post("/perMatchResults", async (req, res) => {
  try {
    const matchId = req.body.matchId;

    const teamStatsColl = client.db("briskFlowPmslDB").collection("teamstats");
    const matchNoColl = client.db("briskFlowPmslDB").collection("matches");
    const teamColl = client.db("briskFlowPmslDB").collection("teams");
    const playerStatsColl = client.db("briskFlowPmslDB").collection("playerstats");
    const playerColl = client.db("briskFlowPmslDB").collection("players");

    const teamStats = await teamStatsColl.find({ match: new ObjectId(matchId) }).toArray();
    const playerStats = await playerStatsColl.find({ match: new ObjectId(matchId) }).toArray();

    let result = {};
    let teamResult = [];
    let playerResult = [];

    for (let i = 0; i < teamStats.length; i++) {
      const data = teamStats[i];
      const matchDoc = await matchNoColl.findOne({ _id: new ObjectId(data.match) });
      const teamDoc = await teamColl.findOne({ _id: new ObjectId(data.team) });

      const matchNo = matchDoc.matchNumber;
      const teamName = teamDoc.name;
      const teamTag = teamDoc.tag;

      const teamData = {
        match: `Match ${matchNo}`,
        team: teamName,
        tag: teamTag,
        kill: data.kill,
        damage: data.damage,
        rank: data.rank,
        placePoint: data.placePoint,
        totalPoint: data.totalPoint,
        wwcd: data.rank === 1 ? 1 : 0,
      };
      teamResult.push(teamData);
    }
    teamResult.sort((a, b) => {
      if (a.totalPoint !== b.totalPoint) {
        return b.totalPoint - a.totalPoint;
      }

      if (a.placePoint !== b.placePoint) {
        return b.placePoint - a.placePoint;
      }
      if (a.kill !== b.kill) {
        return b.kill - a.kill;
      }

      return a.rank - b.rank;
    });
    teamResult.forEach((item, index) => {
      item.cRank = index + 1;
    });

    for (let i = 0; i < playerStats.length; i++) {
      const data = playerStats[i];
      const matchDoc = await matchNoColl.findOne({ _id: new ObjectId(data.match) });
      const playerDoc = await playerColl.findOne({ _id: new ObjectId(data.player) });
      const teamDoc = await teamColl.findOne({ _id: new ObjectId(playerDoc.team) });

      const matchNo = matchDoc.matchNumber;
      const teamName = teamDoc.name;
      const ign = playerDoc.ign;
      const uId = playerDoc.uId;

      const playerData = {
        match: `Match ${matchNo}`,
        teamName: teamName,
        inGameName: ign,
        uId: uId,
        kill: data.kill,
        damage: data.damage,
        dataSurvTime: data.survivalTime,
        survivalTime: toHHMMSS(data.survivalTime),
        assist: data.assist,
        heal: data.heal,
        headshot: data.headshot,
      };
      playerResult.push(playerData);
    }
    playerResult.sort((a, b) => {
      if (a.kill !== b.kill) {
        return b.kill - a.kill;
      }
      if (a.damage !== b.damage) {
        return b.damage - a.damage;
      }
      return b.dataSurvTime - a.dataSurvTime;
    });

    playerResult.forEach((item, index) => {
      item.cRank = index + 1;
    });

    result = {
      teamResult,
      playerResult
    };

    res.status(200).json({ result });

  } catch (err) {
    console.error("Error while fetching data:", err);
    res.status(500).json({ error: "Error while fetching data" });
  }
});

app.post("/api/topTenMvps", async (req, res) => {
  try {
    const matchIds = req.body.matchIds;

    const playerStatsColl = client.db("briskFlowPmslDB").collection("playerstats");
    const matchNoColl = client.db("briskFlowPmslDB").collection("matches");
    const teamColl = client.db("briskFlowPmslDB").collection("teams");
    const playerColl = client.db("briskFlowPmslDB").collection("players");

    let result = {};
    let playerResult = [];

    const playerStatsMap = {};

    let totalSurvivalTime = 0;
    let totalDamage = 0;
    let totalKills = 0;

    for (const matchId of matchIds) {
      const match = await matchNoColl.findOne({ _id: new ObjectId(matchId) });

      if (!match) {
        console.error(`Match with ID ${matchId} not found`);
        continue;
      }

      const playerStats = await playerStatsColl.find({ match: new ObjectId(matchId) }).toArray();

      for (const data of playerStats) {
        const playerId = data.player;

        if (!playerStatsMap[playerId]) {
          playerStatsMap[playerId] = {
            kill: 0,
            damage: 0,
            survivalTime: 0,
            assist: 0,
            heal: 0,
            headshot: 0,
            matchPlayed: 0,
          };
        }

        playerStatsMap[playerId].matchPlayed++;
        playerStatsMap[playerId].kill += data.kill;
        playerStatsMap[playerId].damage += data.damage;
        playerStatsMap[playerId].survivalTime += data.survivalTime;
        playerStatsMap[playerId].assist += data.assist;
        playerStatsMap[playerId].heal += data.heal;
        playerStatsMap[playerId].headshot += data.headshot;
        totalSurvivalTime += data.survivalTime;
        totalDamage += data.damage;
        totalKills += data.kill;
      }
    }

    for (const playerId in playerStatsMap) {
      const playerDoc = await playerColl.findOne({ _id: new ObjectId(playerId) });
      const teamDoc = await teamColl.findOne({ _id: new ObjectId(playerDoc.team) });

      const teamName = teamDoc.name;
      const ign = playerDoc.ign;
      const uId = playerDoc.uId;

      const playerSurvivalTimeRatio = playerStatsMap[playerId].survivalTime / totalSurvivalTime;
      const playerDamageRatio = playerStatsMap[playerId].damage / totalDamage;
      const playerKillRatio = playerStatsMap[playerId].kill / totalKills;

      const MVP = (((playerSurvivalTimeRatio * 0.4) + (playerDamageRatio * 0.4) + (playerKillRatio * 0.2))*100).toFixed(3);
      const survTime = playerStatsMap[playerId].survivalTime/ playerStatsMap[playerId].matchPlayed;
      const avgSurvTime = toHHMMSS(survTime);
      playerResult.push({
        teamName: teamName,
        inGameName: ign,
        uId: uId,
        kill: playerStatsMap[playerId].kill,
        damage: playerStatsMap[playerId].damage,
        matchPlayed: playerStatsMap[playerId].matchPlayed,
        dataSurvTime: survTime,
        survivalTime: avgSurvTime,
        assist: playerStatsMap[playerId].assist,
        heal: playerStatsMap[playerId].heal,
        headshot: playerStatsMap[playerId].headshot,
        mvp: MVP,
      });
    }

    playerResult.sort((a, b) => {
      if (a.mvp !== b.mvp) {
        return b.mvp - a.mvp;
      }
      if (a.kill !== b.kill) {
        return b.kill - a.kill;
      }
      if (a.damage !== b.damage) {
        return b.damage - a.damage;
      }
      return b.dataSurvTime - a.dataSurvTime;
    });
    playerResult.forEach((item, index) => {
      item.cRank = index + 1;
    });

    playerResult = playerResult.slice(0, 10);

    res.status(200).json({ playerResult });
  } catch (err) {
    console.error("Error while fetching data:", err);
    res.status(500).json({ error: "Error while fetching data" });
  }
});