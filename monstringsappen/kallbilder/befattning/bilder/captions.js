// Bildtexter till "Vad gör en X egentligen?": caption-instagram.txt och caption-tiktok.txt per slideshow.
// Instagram: längre text ur slideshowens egna, källbelagda texter, samma hashtags som frågorna, AI-raden sist.
// TikTok: frågornas fem hashtags följda av exakt "AI bild". node captions.js
const fs=require('fs'),path=require('path');
const SH=path.join(__dirname,'slideshows'),UT=path.join(__dirname,'../../output/egentligen');
const slug=s=>s.toLowerCase().replace(/å|ä/g,'a').replace(/ö/g,'o').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const IG='#mönstring #försvarsmakten #värnplikt #lumpen #iprov',TT='#mönstring #försvarsmakten #värnplikt #lumpen #Iprov AI bild';
const AI='AI bild';
const mening=t=>{t=t.trim();return /[.!?]$/.test(t)?t:t+'.'};
let n=0;
for(const f of fs.readdirSync(SH).filter(x=>x.endsWith('.json'))){
 const d=JSON.parse(fs.readFileSync(path.join(SH,f),'utf8'));if(d.saknarKalla)continue;
 const ut=path.join(UT,slug(d.befattning));if(!fs.existsSync(ut))continue;
 const brod=[d.hook[1],...d.slides.slice(0,2).map(s=>s[1])].map(mening).join(' ');
 const slut=d.utanKrav?'Fler befattningar finns i Mönstringsappen, länk i bion.':'Kravprofilen hittar du sist i inlägget. Fler befattningar finns i Mönstringsappen, länk i bion.';
 fs.writeFileSync(path.join(ut,'caption-instagram.txt'),[d.hook[0],brod,slut,IG,AI].join('\n\n')+'\n');
 fs.writeFileSync(path.join(ut,'caption-tiktok.txt'),TT+'\n');n++;
}
console.log('bildtexter',n);
