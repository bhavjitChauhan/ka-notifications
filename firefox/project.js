(()=>{"use strict";var e={400:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.blacklist=void 0,t.blacklist=function(){const e=fetch;window.fetch=async function(t,a){const n=t instanceof Request?t.url:t.toString();return n.startsWith("https://www.khanacademy.org/api/internal/_bb/")||n.startsWith("https://www.khanacademy.org/api/internal/_analytics")||n.includes("ingest.sentry.io/api/")?(console.log("%c[BLOCKED]","color:#f00",n),new Response(null)):await e(t,a)}}}},t={};function a(n){var r=t[n];if(void 0!==r)return r.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,a),s.exports}(()=>{(0,a(400).blacklist)();const e=fetch;window.fetch=async function(t,a){if(t instanceof URL)return e(t,a);const n=t,{url:r}=n;if(!r?.startsWith("https://www.khanacademy.org/api/internal/graphql/getFeedbackRepliesPage"))try{return await e(t,a)}catch(e){return new Response(null,{status:500,statusText:"Internal Server Error"})}return new Promise((async t=>{const a=await n.blob(),r=new FileReader;r.onload=async()=>{const a=r.result,s=JSON.parse(atob(a.split(",")[1]));s.variables.limit=100;const i={body:JSON.stringify(s),cache:n?.cache,credentials:n?.credentials,headers:n?.headers,integrity:n?.integrity,keepalive:n?.keepalive,method:n?.method,mode:n?.mode,redirect:n?.redirect,referrer:n?.referrer,referrerPolicy:n?.referrerPolicy,signal:n?.signal},c=new Request(n.url,i);t(e(c))},r.readAsDataURL(a)}))};const t=new URLSearchParams(window.location.search).get("qa_expand_type");let n,r=0;requestAnimationFrame((function e(){if(!(++r>1e5)){switch(t){case"question":case"answer":n=document.getElementById("ka-uid-discussiontabbedpanel-0--tabbedpanel-tab-0");break;case"comment":case"reply":case null:n=document.getElementById("ka-uid-discussiontabbedpanel-0--tabbedpanel-tab-1");break;case"project_help_question":n=document.getElementById("ka-uid-discussiontabbedpanel-0--tabbedpanel-tab-2")}if(null===n)return requestAnimationFrame(e);n.click(),window.scrollTo({top:0})}}))})()})();