(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{7677:function(e,t,a){Promise.resolve().then(a.bind(a,2241))},2241:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return d}});var r=a(3827),o=a(4090);let n="https://tasty-clam-cloak.cyclic.app/";function d(){let[e,t]=(0,o.useState)(""),[a,d]=(0,o.useState)(""),c=()=>{setTimeout(()=>{t("")},6e3)};(0,o.useEffect)(()=>{l()},[]);let l=async()=>{try{let e=await fetch("".concat(n,"/gesData"),{method:"GET",headers:{"Content-Type":"application/json"}}),a=document.getElementById("event"),r=document.getElementById("stage"),o=document.getElementById("group"),d=document.getElementById("match");if(e.ok){t("Data Retrieved !!");let{event:c,stage:l,group:p}=(await e.json()).gesData,y=[],b=[],h=[];y.push('<option value="" selected>Select Event</option>'),c.forEach(e=>{let t='<option value="'.concat(e._id,'">').concat(e.name,"</option>");y.push(t)}),a.innerHTML=y.join(""),l.forEach(e=>{let t='<option value="'.concat(e._id,'" name="').concat(e.event,'">').concat(e.name,"</option>");b.push(t)}),p.forEach(e=>{let t='<option value="'.concat(e._id,'" name="').concat(e.stage,'">').concat(e.name,"</option>");h.push(t)}),a.addEventListener("change",function(e){let t=e.target.value,a=b.filter(e=>e.includes('name="'.concat(t,'"')));a=['<option value="" selected>Select Stage</option>',...a],r.innerHTML=a.join("")}),r.addEventListener("change",function(e){let t=e.target.value,a=h.filter(e=>e.includes('name="'.concat(t,'"')));a=['<option value="" selected>Select Group</option>',...a],o.innerHTML=a.join("")});let m=[];o.addEventListener("change",async function(e){let t=e.target.value;try{let e=await fetch("".concat(n,"/gesData"),{method:"GET",headers:{"Content-Type":"application/json"}});if(e.ok){let{matchData:a}=(await e.json()).gesData,r=(m=a.filter(e=>e.groupId===t)).map(e=>'<option value="'.concat(e.id,'">Match ').concat(e.matchNo,"</option>")),o=['<option value="" selected>Select Match</option>','<option value="Overall">Overall</option>',...r];d.innerHTML=o.join("")}}catch(e){}}),d.addEventListener("change",async function(e){let t=e.target.value;if("Overall"===t){let e=m.map(e=>e.id);try{let a=await fetch("".concat(n,"/overallResults"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({matchIds:e})});if(a.ok){let e=document.getElementById("stats"),r=document.getElementById("teamList"),o=e.value,n=await a.json(),d=n.result.playerResult,c=n.result.teamResult,l=document.getElementById("teamListDiv");if("teamStats"===o)s(c,"Overall"===t),l.classList.add("hidden");else{i(d,"Overall"===t),l.classList.remove("hidden");let e=c.map(e=>'<option value="'.concat(e.team,'">').concat(e.team,"</option>")),a=['<option value="" selected>Select Match</option>',...e];r.innerHTML=a.join("")}e.addEventListener("change",function(e){let a=e.target.value;if("teamStats"===a)s(c,"Overall"===t),l.classList.add("hidden");else{i(d,"Overall"===t),l.classList.remove("hidden");let e=c.map(e=>'<option value="'.concat(e.team,'">').concat(e.team,"</option>")),a=['<option value="" selected>Select Match</option>',...e];r.innerHTML=a.join("")}}),r.addEventListener("change",function(e){let a=e.target.value,r=d.filter(e=>e.teamName===a);i(r,"Overall"===t)})}}catch(e){console.log("error: ".concat(e))}}else try{let e=await fetch("".concat(n,"/perMatchResults"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({matchId:t})});if(e.ok){let t=document.getElementById("stats"),a=t.value,r=await e.json(),o=r.result.playerResult,n=r.result.teamResult,d=document.getElementById("teamListDiv");if("teamStats"===a)s(n),d.classList.add("hidden");else{i(o),d.classList.remove("hidden");let e=n.map(e=>'<option value="'.concat(e.team,'">').concat(e.team,"</option>")),t=['<option value="" selected>Select Match</option>',...e];teamList.innerHTML=t.join("")}t.addEventListener("change",function(e){let t=e.target.value;if("teamStats"===t)s(n),d.classList.add("hidden");else{i(o);let e=document.getElementById("teamList");d.classList.remove("hidden");let t=n.map(e=>'<option value="'.concat(e.team,'">').concat(e.team,"</option>")),a=['<option value="" selected>Select Match</option>',...t];e.innerHTML=a.join("")}}),teamList.addEventListener("change",function(e){let t=e.target.value,a=o.filter(e=>e.teamName===t);i(a)})}}catch(e){console.log("error")}})}else console.error("Error:",e.status,e.statusText),t("Error: ".concat(e.status," ").concat(e.statusText));c()}catch(e){console.error("Error:",e.message),t("Error: ".concat(e.message)),c()}};function s(e,t){let a=document.querySelector("tbody"),r=document.querySelector("thead");r.innerHTML="",a.innerHTML="";let o=document.createElement("tr");o.innerHTML='\n        <th class="border border-gray-400 px-4 py-2">Rank</th>\n        <th class="border border-gray-400 px-4 py-2">Team</th>\n        <th class="border border-gray-400 px-4 py-2">Tag</th>\n        <th class="border border-gray-400 px-4 py-2">Kills</th>\n        <th class="border border-gray-400 px-4 py-2">Damage</th>\n        <th class="border border-gray-400 px-4 py-2">Place Points</th>\n        <th class="border border-gray-400 px-4 py-2">Total Points</th>\n        <th class="border border-gray-400 px-4 py-2">WWCD</th>\n        <th class="border border-gray-400 px-4 py-2">Match</th>\n        <th class="border border-gray-400 px-4 py-2">Last Match Rank</th>\n        ',e.forEach(e=>{let n=document.createElement("tr");t?n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.team,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.tag,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.placePoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.totalPoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.wwcd,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.matchCount,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.lastMatchRank,"</td>\n            "):n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.team,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.tag,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.placePoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.totalPoint,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.wwcd,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.match,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.rank,"</td>\n            "),r.appendChild(o),a.appendChild(n)})}function i(e,t){let a=document.querySelector("tbody"),r=document.querySelector("thead");r.innerHTML="",a.innerHTML="";let o=document.createElement("tr");t?o.innerHTML='\n        <th class="border border-gray-400 px-4 py-2">Rank</th>\n        <th class="border border-gray-400 px-4 py-2">Team Name</th>\n        <th class="border border-gray-400 px-4 py-2">In Game Name</th>\n        <th class="border border-gray-400 px-4 py-2">UID</th>\n        <th class="border border-gray-400 px-4 py-2">Kills</th>\n        <th class="border border-gray-400 px-4 py-2">Damage</th>\n        <th class="border border-gray-400 px-4 py-2">Survival Time</th>\n        <th class="border border-gray-400 px-4 py-2">Assist</th>\n        <th class="border border-gray-400 px-4 py-2">Heal</th>\n        <th class="border border-gray-400 px-4 py-2">Head Shot</th>\n        <th class="border border-gray-400 px-4 py-2">MVP Rating</th>\n        ':o.innerHTML='\n            <th class="border border-gray-400 px-4 py-2">Rank</th>\n            <th class="border border-gray-400 px-4 py-2">Team Name</th>\n            <th class="border border-gray-400 px-4 py-2">In Game Name</th>\n            <th class="border border-gray-400 px-4 py-2">UID</th>\n            <th class="border border-gray-400 px-4 py-2">Kills</th>\n            <th class="border border-gray-400 px-4 py-2">Damage</th>\n            <th class="border border-gray-400 px-4 py-2">Survival Time</th>\n            <th class="border border-gray-400 px-4 py-2">Assist</th>\n            <th class="border border-gray-400 px-4 py-2">Heal</th>\n            <th class="border border-gray-400 px-4 py-2">Head Shot</th>\n            ',e.forEach(e=>{let n=document.createElement("tr");t?n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.teamName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.inGameName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.uId,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.survivalTime,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.assist,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.heal,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.headshot,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.mvp,"</td>\n            "):n.innerHTML='\n                <td class="border border-gray-400 px-2 py-1">'.concat(e.cRank,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.teamName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.inGameName,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.uId,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.kill,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.damage,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.survivalTime,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.assist,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.heal,'</td>\n                <td class="border border-gray-400 px-2 py-1">').concat(e.headshot,"</td>\n            "),r.appendChild(o),a.appendChild(n)})}return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"flex flex-wrap items-center",children:[(0,r.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,r.jsx)("label",{htmlFor:"event",children:"Event"}),(0,r.jsx)("select",{id:"event",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,r.jsx)("option",{value:"",children:"Select Event"})})]}),(0,r.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,r.jsx)("label",{htmlFor:"stage",children:"Stage"}),(0,r.jsx)("select",{id:"stage",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,r.jsx)("option",{value:"",children:"Select Stage"})})]}),(0,r.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,r.jsx)("label",{htmlFor:"group",children:"Group"}),(0,r.jsx)("select",{id:"group",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,r.jsx)("option",{value:"",children:"Select Group"})})]}),(0,r.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,r.jsx)("label",{htmlFor:"stats",children:"Stats"}),(0,r.jsxs)("select",{id:"stats",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:[(0,r.jsx)("option",{value:"teamStats",children:"Team Stats"}),(0,r.jsx)("option",{value:"playerStats",children:"Player Stats"})]})]}),(0,r.jsxs)("div",{className:"flex flex-col ml-4",children:[(0,r.jsx)("label",{htmlFor:"match",children:"Match"}),(0,r.jsx)("select",{id:"match",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,r.jsx)("option",{value:"",children:"Select Match"})})]}),(0,r.jsxs)("div",{id:"teamListDiv",className:"flex flex-col ml-4 hidden",children:[(0,r.jsx)("label",{htmlFor:"teamList",children:"Team List"}),(0,r.jsx)("select",{id:"teamList",className:"w-full p-3 mb-4 dark:text-black border rounded-md",children:(0,r.jsx)("option",{value:"",children:"Select Team"})})]})]}),(0,r.jsx)("h5",{className:"mt-4",children:e}),(0,r.jsx)("div",{className:"overflow-x-auto text-center",children:(0,r.jsxs)("table",{className:"table-auto border-collapse border border-gray-800 w-42 mx-auto",children:[(0,r.jsx)("thead",{}),(0,r.jsx)("tbody",{})]})})]})}}},function(e){e.O(0,[971,69,744],function(){return e(e.s=7677)}),_N_E=e.O()}]);