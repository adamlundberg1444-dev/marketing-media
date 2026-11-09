// "Vad gör egentligen"-slideshow, ny design. Samma bild på alla slides, TikToks textrutor,
// hela kravprofilen före CTA:n. Kravvärdena kommer ur befattningslistan, aldrig för hand.
// node rendera-test.js <fil i slideshows/>
const path=require('path'),fs=require('fs');
const g=require('../../generate_befattning.js');const {renderSpec}=require('../../../../../core/render');
const BEIGE='#EFE6D2',VIT='#FFFFFF',INK='#0A0A0A';
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'slideshows',process.argv[2]),'utf8'));
const ks=g.kravStats(d.befattning), p=g.position(d.befattning), langd=ks.langd;
const gu=String(ks.version).match(/GU(\d\d)-(\d\d)/); if(!gu)throw new Error('Okänd kravversion: '+ks.version);
const skala=v=>v==null?'–':`${v} / 9`;
const rader=[['Styrka',skala(p.muskelstyrka)],['Kondition',skala(p['fysiskArbetsförmåga'])],['I-provet',skala(p['generellBegåvning'])],['Befäl',skala(p['befäl'])],['Plikttjänstförmåga',skala(p['plikttjänstförmåga'])],['Längd',langd||'–'],['Syn',p.syn||'–'],['Färgseende',p['färgseende']===9?'Krävs':'Ej krav'],['Hörsel',p['hörsel']||'–'],['Tjänstbarhet',p['tjänstbarhet']||'–']];
[['jägartest','Jägartest'],['simultankapacitet','Simultankapacitet'],['utökadMönstring','Utökad mönstring'],['ejPälsdjursallergi','Ej pälsdjursallergi'],['körkortB','Körkort B']].forEach(([k,t])=>{if(p[k])rader.push([t,'Krävs'])});
const kort=`<div style="position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);background:#FFFFFF;border-radius:44px;padding:48px 52px 34px;color:${INK}">
 <div style="font-size:62px;font-weight:800;letter-spacing:-1px;margin-bottom:26px">Kravprofil ${d.befattning.toLowerCase()}</div>
 ${rader.map(([a,b],i)=>`<div style="display:flex;justify-content:space-between;align-items:baseline;padding:17px 0;${i?'border-top:2px solid #ECE7DC;':''}font-size:42px;font-weight:700"><span>${a}</span><span style="font-weight:800">${b}</span></div>`).join('')}
 <div style="margin-top:22px;padding-top:24px;border-top:2px solid #ECE7DC;font-size:32px;line-height:1.35;font-weight:600;color:#55504A"><span style="color:#D92D20;font-weight:900">OBS!</span> Baseras på kravprofilerna för grundutbildning 20${gu[1]}/${gu[2]}. Det här är minimikrav, vill du ha större chans till en plats bör du sikta högre.</div>
</div>`;
const bg={bgImage:`bg/hook/befattning/${d.bild}`,bgScrim:'rgba(10,14,8,0.10)'};
const st=(k,t)=>({kind:'stickers',theme:'skog',...bg,align:'top',union:true,stickers:t.map((x,j)=>({text:x,color:j?VIT:BEIGE,fg:INK})),...k});
const logo='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../../assets/bg/hook/befattning/logo-keps.png')).toString('base64');
const apple=fs.readFileSync(path.join(__dirname,'../../../../../core/blocks.js'),'utf8').match(/<svg viewBox="0 0 384 512"[^`]*?<\/svg>/)[0];
const play=`<svg viewBox="0 0 512 512" width="62" height="62"><path fill="#00D7FE" d="M48 32v448L272 256z"/><path fill="#00F076" d="M48 32l288 160-64 64z"/><path fill="#FF3A44" d="M48 480l288-160-64-64z"/><path fill="#FFD500" d="M336 192l112 64-112 64-64-64z"/></svg>`;
const knapp=(ikon,liten,stor)=>`<div style="display:flex;align-items:center;gap:18px;background:#0A0A0A;color:#fff;border-radius:22px;padding:18px 30px">${ikon}<div style="display:flex;flex-direction:column;line-height:1.1"><span style="font-size:24px;font-weight:600">${liten}</span><span style="font-size:42px;font-weight:700;letter-spacing:-0.5px">${stor}</span></div></div>`;
const cta={kind:'html',theme:'skog',bgImage:'bg/hook/befattning/cta-jagare.jpg',bgScrim:'rgba(0,0,0,0)',html:`<div style="position:absolute;left:60px;top:150px;right:60px">
 <div style="display:flex;align-items:center;gap:34px"><img src="${logo}" style="width:220px;height:auto;flex:none">
 <div style="font-family:'DIN Condensed';font-weight:700;font-size:112px;line-height:0.98;letter-spacing:1px;color:#2A3324;text-transform:uppercase;text-align:left">Se fler<br>kravprofiler i<br>Mönstringsappen</div></div>
 <div style="display:flex;gap:22px;margin-top:44px">${knapp(apple.replace('<svg ','<svg width="50" height="60" '),'Hämta i','App Store')}${knapp(play,'Hämta på','Google Play')}</div>
</div>`};
// Svårast: summan av styrka, kondition och I-prov på 17 eller mer, eller utökad mönstring. Allt räknas ur listan.
const alla=g.kravStats(d.befattning).alla||require(path.join(g.APP_DIR,'content','kravprofiler.json')).positions;
const svar=[];
if((p.difficultyScore||0)>=17||p['utökadMönstring']){
 const fa=p['fysiskArbetsförmåga'], nFa=alla.filter(x=>(x['fysiskArbetsförmåga']||0)>=fa).length, pl=/^\d+$/.test(String(p.platser))?`Det finns bara ${p.platser} platser, och `:'';
 const t=`${pl}${pl?'bara':'Bara'} ${nFa} av ${alla.length} befattningar kräver kondition ${fa} eller mer. Räkna med att du behöver ligga långt över kravlistan.`;
 svar.push(st({},[`${d.befattning} är en av de svåraste befattningarna`,t]));
}
const slides=[st({bottenText:'Kravprofilen sist 👉',bottenFarg:VIT},d.hook),...d.slides.map(t=>st({},t)),{kind:'html',theme:'skog',...bg,html:kort},...svar,cta];
(async()=>{const spec={slug:`egentligen_${p.slug}`,caption:d.hook[0],tiktokTitle:d.hook[0],slides};
 const out=path.resolve(__dirname,'../../output',spec.slug);fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
 const f=await renderSpec(spec,{appDir:g.APP_DIR,outDir:out});console.log(f.length,out)})().catch(e=>{console.error(e);process.exit(1)});
