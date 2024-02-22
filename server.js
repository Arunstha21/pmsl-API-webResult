const express = require("express");
const app = express();
const port = 3001;

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
require('dotenv').config()
app.use(bodyParser.json());
const pmslDB = process.env.PMSL_DBURL;
const cors = require('cors')
app.use(cors());

const client = new MongoClient(pmslDB);

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
        groupId : match.group,
        matchNo : match.matchNumber,
      }
      matchData.push(data);
    })
    const groupDataWithoutSlots = group.map(({ slotList, ...rest }) => rest);
    const gesData = {
      event,
      stage,
      group : groupDataWithoutSlots,
      matchData,
    };
    res.status(200).json({gesData});

  } catch (err) {
    console.error("Error while fetching data:", err);
    res.status(500).json({ error: "Error while fetching data" });
  }
});

app.post("/overallResults", async (req, res) => {
  try {
    const matchIds = req.body.matchIds;
    const teamStatsColl = client.db("briskFlowPmslDB").collection("teamstats");
    const matchNoColl = client.db("briskFlowPmslDB").collection("matches");
    const teamColl = client.db("briskFlowPmslDB").collection("teams");
    let result = [];
    const teamStatsMap = {};

    for (const matchId of matchIds) {
      const match = await matchNoColl.findOne({ _id: new ObjectId(matchId) });

      if (!match) {
        console.error(`Match with ID ${matchId} not found`);
        continue;
      }

      const teamStats = await teamStatsColl.find({ match: new ObjectId(matchId) }).toArray();

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

    }

    for (const teamId in teamStatsMap) {
      const teamDoc = await teamColl.findOne({ _id: new ObjectId(teamId) });
      const teamName = teamDoc.name;
      const teamTag = teamDoc.tag;

      result.push({
        team: teamName,
        tag: teamTag,
        kill: teamStatsMap[teamId].kill,
        damage: teamStatsMap[teamId].damage,
        matchCount: teamStatsMap[teamId].matchCount,
        placePoint: teamStatsMap[teamId].placePoint,
        totalPoint: teamStatsMap[teamId].totalPoint,
        lastMatchRank: teamStatsMap[teamId].lastMatchRank,
        wwcd:teamStatsMap[teamId].wwcd
      });
    }

    result.sort((a, b) => {
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

      return a.rank - b.rank;
    });
    result.forEach((item, index) => {
      item.cRank = index + 1;
    });

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
      const teamStats = await teamStatsColl.find({match : new ObjectId(matchId)}).toArray();

      let result = [];
  
      for (let i = 0; i < teamStats.length; i++) {
        const data = teamStats[i];
        const matchDoc = await matchNoColl.findOne({ _id: new ObjectId(data.match) });
        const teamDoc = await teamColl.findOne({ _id: new ObjectId(data.team) });
  
        const matchNo = matchDoc.matchNumber;
        const teamName = teamDoc.name;
        const teamTag = teamDoc.tag;
  
        const sorted = {
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
        result.push(sorted);
      }
      result.sort((a, b) => {
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
      result.forEach((item, index) => {
        item.cRank = index + 1;
      });

      res.status(200).json({result});

  } catch (err) {
    console.error("Error while fetching data:", err);
    res.status(500).json({ error: "Error while fetching data" });
  }
});