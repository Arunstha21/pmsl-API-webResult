(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{7677:function(e,t,r){Promise.resolve().then(r.bind(r,2241))},2241:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return d}});var a=r(3827),o=r(4090);let n="https://tasty-clam-cloak.cyclic.app/";function d(){let[e,t]=(0,o.useState)(""),[r,d]=(0,o.useState)(""),c=()=>{setTimeout(()=>{t("")},6e3)};(0,o.useEffect)(()=>{l()},[]);let l=async()=>{try{let e=await fetch("".concat(n,"/gesData"),{method:"GET",headers:{"Content-Type":"application/json"}}),r=document.getElementById("event"),a=document.getElementById("stage"),o=document.getElementById("group"),d=document.getElementById("match");if(e.ok){t("Data Retrieved !!");let{event:c,stage:l,group:y}=(await e.json()).gesData,i=[],b=[],h=[];i.push('<option value="" selected>Select Event</option>'),c.forEach(e=>{let t='<option value="'.concat(e._id,'">').concat(e.name,"</option>");i.push(t)}),r.innerHTML=i.join(""),l.forEach(e=>{let t='<option value="'.concat(e._id,'" name="').concat(e.event,'">').concat(e.name,"</option>");b.push(t)}),y.forEach(e=>{let t='<option value="'.concat(e._id,'" name="').concat(e.stage,'">').concat(e.name,"</option>");h.push(t)}),r.addEventListener("change",function(e){let t=e.target.value,r=b.filter(e=>e.includes('name="'.concat(t,'"')));r=['<option value="" selected>Select Stage</option>',...r],a.innerHTML=r.join("")}),a.addEventListener("change",function(e){let t=e.target.value,r=h.filter(e=>e.includes('name="'.concat(t,'"')));r=['<option value="" selected>Select Group</option>',...r],o.innerHTML=r.join("")});let m=[];o.addEventListener("change",async function(e){let t=e.target.value;try{let e=await fetch("".concat(n,"/gesData"),{method:"GET",headers:{"Content-Type":"application/json"}});if(e.ok){let{matchData:r}=(await e.json()).gesData,a=(m=r.filter(e=>e.groupId===t)).map(e=>'<option value="'.concat(e.id,'">Match ').concat(e.matchNo,"</option>")),o=['<option value="" selected>Select Match</option>','<option value="Overall">Overall</option>',...a];d.innerHTML=o.join("")}}catch(e){}}),d.addEventListener("change",async function(e){let t=e.target.value;if("Overall"===t){let e=m.map(e=>e.id);try{let r=await fetch("".concat(n,"/overallResults"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({matchIds:e})});if(r.ok){let e=document.getElementById("stats"),a=e.value,o=await r.json();if("teamStats"===a){let e=o.result.teamResult;s(e,"Overall"===t)}else{let e=o.result.playerResult;p(e,"Overall"===t)}e.addEventListener("change",function(e){let r=e.target.value;if("teamStats"===r){let e=o.result.teamResult;s(e,"Overall"===t)}else{let e=o.result.playerResult;p(e,"Overall"===t)}})}}catch(e){console.log("error: ".concat(e))}}else try{let e=await fetch("".concat(n,"/perMatchResults"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({matchId:t})});if(e.ok){let t=document.getElementById("stats"),r=t.value,a=await e.json();if("teamStats"===r){let e=a.result.teamResult;s(e)}else{let e=a.result.playerResult;p(e)}t.addEventListener("change",function(e){let t=e.target.value;if("teamStats"===t){let e=a.result.teamResult;s(e)}else{let e=a.result.playerResult;p(e)}})}}catch(e){console.log("error")}})}else console.error("Error:",e.status,e.statusText),t("Error: ".concat(e.status," ").concat(e.statusText));c()}catch(e){console.error("Error:",e.message),t("Error: ".concat(e.message)),c()}};function s(e,t){let r=document.querySelector("tbody"),a=document.querySelector("thead");a.innerHTML="",r.innerHTML="";let o=document.createElement("tr");o.innerHTML='\n        <th class="border border-gray-400 px-4 py-2">Rank</th>\n        <th class="border border-gray-400 px-4 py-2">Team</th>\n        <th class="border border-gray-400 px-4 py-2">Tag</th>\n        <th class="border border-gray-400 px-4 py-2">Kills</th>\n        <th class="border border-gray-400 px-4 py-2">Damage</th>\n        <th class="border border-gray-400 px-4 py-2">Place Points</th>\n        <th class="border border-gray-400 px-4 py-2">Total Points</th>\n        <th class="border border-gray-400 px-4 py-2">WWCD</th>\n        <th class="border border-gray-400 px-4 py-2">Match</th>\n        <th class="border border-gray-400 px-4 py-2">Last Match Rank</th>\n        ',e.forEach(e=>{let n=document.createElement("tr");t?n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.team,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.tag,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.placePoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.totalPoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.wwcd,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.matchCount,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.lastMatchRank,"</td>\n            "):n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.team,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.tag,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.placePoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.totalPoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.wwcd,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.match,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.rank,"</td>\n            "),a.appendChild(o),r.appendChild(n)})}function p(e,t){let r=document.querySelector("tbody"),a=document.querySelector("thead");a.innerHTML="",r.innerHTML="";let o=document.createElement("tr");t?o.innerHTML='\n        <th class="border border-gray-400 px-4 py-2">Rank</th>\n        <th class="border border-gray-400 px-4 py-2">Team Name</th>\n        <th class="border border-gray-400 px-4 py-2">In Game Name</th>\n        <th class="border border-gray-400 px-4 py-2">UID</th>\n        <th class="border border-gray-400 px-4 py-2">Kills</th>\n        <th class="border border-gray-400 px-4 py-2">Damage</th>\n        <th class="border border-gray-400 px-4 py-2">Survival Time</th>\n        <th class="border border-gray-400 px-4 py-2">Assist</th>\n        <th class="border border-gray-400 px-4 py-2">Heal</th>\n        <th class="border border-gray-400 px-4 py-2">Head Shot</th>\n        <th class="border border-gray-400 px-4 py-2">MVP Rating</th>\n        ':o.innerHTML='\n            <th class="border border-gray-400 px-4 py-2">Rank</th>\n            <th class="border border-gray-400 px-4 py-2">Team Name</th>\n            <th class="border border-gray-400 px-4 py-2">In Game Name</th>\n            <th class="border border-gray-400 px-4 py-2">UID</th>\n            <th class="border border-gray-400 px-4 py-2">Kills</th>\n            <th class="border border-gray-400 px-4 py-2">Damage</th>\n            <th class="border border-gray-400 px-4 py-2">Survival Time</th>\n            <th class="border border-gray-400 px-4 py-2">Assist</th>\n            <th class="border border-gray-400 px-4 py-2">Heal</th>\n            <th class="border border-gray-400 px-4 py-2">Head Shot</th>\n            ',e.forEach(e=>{let n=document.createElement("tr");t?n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.teamName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.inGameName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.uId,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.survivalTime,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.assist,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.heal,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.headshot,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.mvp,"</td>\n            "):n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.teamName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.inGameName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.uId,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.survivalTime,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.assist,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.heal,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.headshot,"</td>\n            "),a.appendChild(o),r.appendChild(n)})}return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"flex flex-wrap items-center",children:[(0,a.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,a.jsx)("label",{htmlFor:"event",children:"Event"}),(0,a.jsx)("select",{id:"event",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,a.jsx)("option",{value:"",children:"Select Event"})})]}),(0,a.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,a.jsx)("label",{htmlFor:"stage",children:"Stage"}),(0,a.jsx)("select",{id:"stage",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,a.jsx)("option",{value:"",children:"Select Stage"})})]}),(0,a.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,a.jsx)("label",{htmlFor:"group",children:"Group"}),(0,a.jsx)("select",{id:"group",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,a.jsx)("option",{value:"",children:"Select Group"})})]}),(0,a.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,a.jsx)("label",{htmlFor:"stats",children:"Stats"}),(0,a.jsxs)("select",{id:"stats",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:[(0,a.jsx)("option",{value:"teamStats",children:"Team Stats"}),(0,a.jsx)("option",{value:"playerStats",children:"Player Stats"})]})]}),(0,a.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,a.jsx)("label",{htmlFor:"match",children:"Match"}),(0,a.jsx)("select",{id:"match",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,a.jsx)("option",{value:"",children:"Select Match"})})]})]}),(0,a.jsx)("h5",{className:"mt-4",children:e}),(0,a.jsx)("div",{className:"overflow-x-auto text-center",children:(0,a.jsxs)("table",{className:"table-auto border-collapse border border-gray-800 w-42 mx-auto",children:[(0,a.jsx)("thead",{}),(0,a.jsx)("tbody",{})]})})]})}}},function(e){e.O(0,[971,69,744],function(){return e(e.s=7677)}),_N_E=e.O()}]);