(()=>{"use strict";!function(){const t=fetch;window.fetch=async function(n,s){const{url:a}=n;return a.startsWith("https://www.khanacademy.org/api/internal/_bb/")||a.startsWith("https://www.khanacademy.org/api/internal/_analytics")||a.startsWith("https://o8287.ingest.sentry.io/api/")?(console.log("%c[BLOCKED]","color:#f00",a),new Response(null)):t(n,s)}}()})();