// node rendera-ig.js [slug ...]: 3:4-versioner för Instagram i output/egentligen/<slug>/ig/ (1080x1440).
// Instagram stoppar 9:16 i karuseller. Kravkortet skalas ner för att rymmas; marginalerna blir lika på båda sidor.
const path=require('path'),fs=require('fs'),{execFileSync}=require('child_process');
const {renderSpec}=require('../../../../../core/render'); const {bygg,slug,g}=require('./mall');
const SH=path.join(__dirname,'slideshows'),UT=path.resolve(__dirname,'../../output/egentligen');
const val=process.argv.slice(2);
const anpassa=s=>{if(s.kind!=='html')return s;let h=s.html;
 if(h.includes('Kravprofil</div>')){const rader=h.split('justify-content:space-between').length-1,skala=rader>14?0.8:rader>12?0.88:0.95;h=h.replace('left:84px;right:136px;top:50%;transform:translateY(-50%)',`left:50%;top:50%;width:860px;transform:translate(-50%,-50%) scale(${skala})`)}
 return {...s,html:h}};
(async()=>{let n=0;
 for(const f of fs.readdirSync(SH).filter(x=>x.endsWith('.json'))){
  const d=JSON.parse(fs.readFileSync(path.join(SH,f),'utf8'));if(d.saknarKalla||d.kontroll)continue;
  const s=slug(d.befattning);if(val.length&&!val.includes(s))continue;
  const ut=path.join(UT,s,'ig');if(!val.length&&fs.existsSync(path.join(ut,'slide-01.jpg')))continue;
  if(!fs.existsSync(path.join(UT,s)))continue;
  const {spec}=bygg(d);spec.slides=spec.slides.map(anpassa);
  fs.rmSync(ut,{recursive:true,force:true});fs.mkdirSync(ut,{recursive:true});
  await renderSpec(spec,{appDir:g.APP_DIR,outDir:ut,format:'3:4'});
  for(const x of fs.readdirSync(ut)){if(x.endsWith('.jpg'))execFileSync('sips',['-Z','1440',path.join(ut,x)],{stdio:'ignore'});else fs.rmSync(path.join(ut,x),{recursive:true,force:true})}
  n++;if(n%10==0)console.log('klar',n);
 }
 console.log('renderade',n);
})();
