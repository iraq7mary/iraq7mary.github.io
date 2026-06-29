(function(){
  var L=window.LABELS||{}, ZONES=window.TZLIST||[];
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');}
  function fmtZone(d,tz){try{return new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(d);}catch(e){return '-';}}
  function offset(d,tz){try{var p=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'shortOffset'}).formatToParts(d).find(function(x){return x.type==='timeZoneName';});return p?p.value:'';}catch(e){return '';}}
  function clocks(){
    var d=new Date(), ts=Math.floor(d.getTime()/1000);
    var local=''; try{local=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
    var h='<div class="now"><b>'+esc(L.now_ts)+':</b> <span id="live-ts">'+ts+'</span> &nbsp; <span class="note">'+esc(L.local_tz)+': '+esc(local)+'</span></div>';
    h+='<table><tr><th>'+esc(L.region)+'</th><th>'+esc(L.tz_name)+'</th><th>'+esc(L.local_time)+'</th><th>UTC</th></tr>';
    ZONES.forEach(function(z){h+='<tr><td>'+esc(z.label)+'</td><td>'+esc(z.tz)+'</td><td>'+esc(fmtZone(d,z.tz))+'</td><td>'+esc(offset(d,z.tz))+'</td></tr>';});
    h+='</table>';
    var el=document.getElementById('clk-out'); if(el) el.innerHTML=h;
  }
  function convert(){
    var raw=(document.getElementById('ts-in').value||'').trim(), out=document.getElementById('conv-out');
    if(!out) return; if(!raw){out.innerHTML='';return;}
    var d;
    if(/^-?\d{1,14}$/.test(raw)){var n=parseInt(raw,10); d=new Date(raw.length>11?n:n*1000);}
    else {var t=Date.parse(raw); if(isNaN(t)){out.innerHTML='<div class="card">'+esc(L.bad_input)+'</div>';return;} d=new Date(t);}
    if(isNaN(d.getTime())){out.innerHTML='<div class="card">'+esc(L.bad_input)+'</div>';return;}
    var ts=Math.floor(d.getTime()/1000);
    var h='<div class="card"><div class="label">'+esc(L.unix_ts)+'</div><div class="code">'+ts+'</div>';
    h+='<div class="label">UTC</div><div>'+esc(fmtZone(d,'UTC'))+'</div>';
    ZONES.slice(0,5).forEach(function(z){if(z.tz!=='UTC') h+='<div class="label">'+esc(z.label)+' ('+esc(z.tz)+')</div><div>'+esc(fmtZone(d,z.tz))+'</div>';});
    h+='</div>'; out.innerHTML=h;
  }
  function init(){
    clocks();
    setInterval(function(){var e=document.getElementById('live-ts'); if(e) e.textContent=Math.floor(Date.now()/1000);},1000);
    var b=document.getElementById('conv-go'); if(b) b.addEventListener('click',convert);
    var i=document.getElementById('ts-in'); if(i) i.addEventListener('keydown',function(e){if(e.key==='Enter')convert();});
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
})();