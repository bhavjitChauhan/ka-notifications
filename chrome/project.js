(()=>{"use strict";function e(e){return{body:e.body,cache:e.cache,credentials:e.credentials,headers:e.headers,integrity:e.integrity,keepalive:e.keepalive,method:e.method,mode:e.mode,redirect:e.redirect,referrer:e.referrer,referrerPolicy:e.referrerPolicy,signal:e.signal}}!function(){const e=fetch;window.fetch=async function(t,a){const{url:n}=t;return n.startsWith("https://www.khanacademy.org/api/internal/_bb/")||n.startsWith("https://www.khanacademy.org/api/internal/_analytics")||n.startsWith("https://o8287.ingest.sentry.io/api/")?(console.log("%c[BLOCKED]","color:#f00",n),new Response(null)):e(t,a)}}();const t=fetch;window.fetch=async function(a,n){const{url:s}=a;return s?.startsWith("https://www.khanacademy.org/api/internal/graphql/getFeedbackRepliesPage")?new Promise((async n=>{const s=await a.blob(),r=new FileReader;r.onload=async()=>{const s=r.result,i=JSON.parse(atob(s.split(",")[1]));i.variables.limit=100;const c=new Request(a.url,{...e(a),body:JSON.stringify(i)});n(t(c))},r.readAsDataURL(s)})):t(a,n).catch(Math.abs)};const a=new URLSearchParams(window.location.search).get("qa_expand_type");let n,s=0;requestAnimationFrame((function e(){if(!(s++>1e5)){switch(a){case"question":case"answer":n=document.getElementById("ka-uid-discussiontabbedpanel-0--tabbedpanel-tab-0");break;case"comment":case"reply":case null:n=document.getElementById("ka-uid-discussiontabbedpanel-0--tabbedpanel-tab-1");break;case"project_help_question":n=document.getElementById("ka-uid-discussiontabbedpanel-0--tabbedpanel-tab-2")}if(null===n)return requestAnimationFrame(e);window.scrollY,n.click(),window.scrollTo({top:0})}}))})();