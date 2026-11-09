// Spegelbilder till Mönstringsappens TikTok. Gemini på Vertex med ADC. Hoppar över färdiga bilder.
// node generera.mjs [max-nummer] [parallella]
import {execFileSync} from 'child_process'; import fs from 'fs'; import path from 'path';
const DIR=path.dirname(new URL(import.meta.url).pathname);
const MAX=+(process.argv[2]||61), PAR=+(process.argv[3]||2);
const P=execFileSync('gcloud',['config','get-value','project'],{encoding:'utf8'}).trim();
let tok=null,tokAt=0; const token=()=>{if(!tok||Date.now()-tokAt>25*60e3){tok=execFileSync('gcloud',['auth','application-default','print-access-token'],{encoding:'utf8'}).trim();tokAt=Date.now()}return tok};
const ANTAL={erik:61,amir:61,linus:61,elin:61,sara:60};
const VEM={erik:'man',amir:'man',linus:'man',elin:'woman',sara:'woman'};
const RUM=[
 'a Swedish army barracks room with grey metal lockers and a made bunk bed, a mirror on the locker door',
 'a shared barracks washroom with a row of white sinks and a wide wall mirror',
 'a military gym with weights and rubber floor, wall mirror',
 'a locker room with wooden benches and grey lockers, wall mirror',
 'a small home bathroom with white tiles and a towel on a hook',
 'a home hallway with a full-length mirror, jackets on hooks and boots on the floor',
 'a bedroom with a wardrobe mirror door, an unmade bed and a green duffel bag',
 'an elevator with brushed steel walls and a large mirror',
 'a clothing store fitting room with a curtain and a bright mirror',
 'a simple hotel room bathroom with warm light',
 'a public gym changing room with a long mirror and hair dryers',
 'a train toilet with a small mirror and steel surfaces',
 'a garrison corridor with painted concrete walls and a full-length mirror by the door',
 'a laundry room with washing machines and a mirror leaning on the wall',
 'a student apartment entrance with a mirror and a bicycle helmet on a shelf',
 'a garrison shower room with grey tiles and a large fixed wall mirror above the sinks',
 'a wooden sauna changing room in a Swedish cabin with a mirror on the pine wall',
 'a staircase landing in an apartment building with a leaning mirror',
];
const POSE=[
 'phone held at chest height with one hand, other arm relaxed at the side',
 'phone held high beside the face, chin slightly up',
 'standing slightly turned to the side, looking at the phone screen',
 'free hand in the trouser pocket, weight on one leg',
 'leaning a shoulder against the wall next to the mirror',
 'free hand adjusting the collar',
 'sitting on a bench or edge of a bed facing the mirror',
 'free hand holding a green cap',
 'free hand running through the hair',
 'one step closer to the mirror, upper body filling the frame',
 'standing straight a little back from the mirror, relaxed',
 'free hand holding a water bottle, slightly tired after training',
];
const KLADER=[
 'a Swedish M90 camouflage field jacket, open, over an olive t-shirt, with M90 trousers',
 'an olive t-shirt with M90 camouflage trousers and a green belt',
 'a full M90 camouflage field uniform with sleeves rolled up',
 'an olive fleece jacket with M90 camouflage trousers',
 'an olive long-sleeve base layer with M90 camouflage trousers and black boots',
 'an M90 camouflage field shirt, buttoned, with a green cap',
 'a dark green hoodie with M90 camouflage trousers',
];
const UTTRYCK=['calm and confident','a small relaxed smile','focused and serious','tired but content','neutral and casual','a slightly amused look'];
const LJUS=['ordinary indoor ceiling light','soft daylight from a window','warm evening lamp light','cool morning light','slightly harsh overhead fluorescent light'];
// Var femte bild (20 %) är civil: gymmet, löprundan eller hemma.
const CIVIL=[
 {rum:'a commercial gym with weights and a large wall mirror',klader:'plain black training shorts or leggings and a plain grey training t-shirt',pose:'free hand on the hip, slightly sweaty after a set'},
 {rum:'a gym changing room with a long mirror',klader:'a plain dark training t-shirt and training shorts or leggings, a towel over the shoulder',pose:'standing relaxed after the workout'},
 {rum:'a home hallway with a full-length mirror and running shoes on the floor',klader:'a plain running jacket, running tights and a cap',pose:'just back from a run, a little out of breath, cheeks red'},
 {rum:'a home bedroom with a wardrobe mirror door and soft daylight',klader:'a plain grey hoodie and sweatpants',pose:'relaxed at home, free hand holding a mug'},
 {rum:'a cosy living room with a leaning floor mirror and a sofa behind',klader:'a plain white t-shirt and comfortable sweatpants',pose:'casual, lazy Sunday mood, standing barefoot'},
 {rum:'a small home bathroom with white tiles',klader:'a plain knitted sweater and jeans',pose:'getting ready to go out, free hand adjusting the hair'},
];
const skapa=(n,i)=>{ // i från 2: ny kombination, karaktärerna förskjutna så att de inte får samma rad
 const o=Object.keys(ANTAL).indexOf(n)*3+i;
 if(i%5===0){const c=CIVIL[(Math.floor(i/5)+Object.keys(ANTAL).indexOf(n))%CIVIL.length];return {...c,civil:true,uttryck:UTTRYCK[o%UTTRYCK.length],ljus:LJUS[(o*2+Math.floor(o/5))%LJUS.length]}}
 return {rum:RUM[(o*5)%RUM.length],pose:POSE[(o*7+Math.floor(o/12))%POSE.length],klader:KLADER[(o*3+Math.floor(o/7))%KLADER.length],uttryck:UTTRYCK[o%UTTRYCK.length],ljus:LJUS[(o*2+Math.floor(o/5))%LJUS.length]};
};
const prompt=(n,s)=>`Image 1 shows the exact person to use: keep the same face, age, hair, skin tone and build, so they are clearly recognisable as the same fictional adult ${VEM[n]}, 22 to 25 years old. ${s.civil?'This photo is from free time: no military clothing and no camouflage at all.':'Image 2 is a fabric swatch showing Swedish M90 splinter camouflage with angular light green, dark green and black shapes. Use exactly that pattern on any camouflage clothing.'}

New photo: an unedited, amateur smartphone mirror selfie, vertical, that looks like a real photo from someone's camera roll. Setting: ${s.rum}. Wearing ${s.klader}. Pose: ${s.pose}, in a natural everyday stance with both feet flat on the floor unless sitting. Never lift a leg, never put a foot on a sink, toilet, bench or anything else, and never stand in an awkward or posed way. Expression: ${s.uttryck}. Light: ${s.ljus}.

The person holds a black iPhone with three rear cameras in one hand, and the phone is visible in the reflection. The face is clearly visible beside the phone, not hidden. Natural skin texture with pores, realistic hands with five fingers, slight smudges on the mirror, believable reflection, ordinary phone-camera quality. Only this one person in the photo. No weapons. No flags, no badges, no name tapes, no logos, no signs, no text, no date stamp and no watermark anywhere.`;
const manifest=path.join(DIR,'manifest.json'); const M=fs.existsSync(manifest)?JSON.parse(fs.readFileSync(manifest)):{};
const b64=f=>fs.readFileSync(f).toString('base64');
const jobb=[]; for(let i=2;i<=MAX;i++)for(const n of Object.keys(ANTAL)){if(i>ANTAL[n])continue;const id=String(i).padStart(3,'0');if(!fs.existsSync(path.join(DIR,n,id+'.png')))jobb.push({n,i,id})}
console.log('att göra',jobb.length);
const vanta=ms=>new Promise(r=>setTimeout(r,ms));
let klara=0,fel=0;
async function en({n,i,id}){const s=skapa(n,i);
 for(let f=1;f<=12;f++){try{
  const r=await fetch(`https://aiplatform.googleapis.com/v1/projects/${P}/locations/global/publishers/google/models/gemini-3-pro-image:generateContent`,{method:'POST',signal:AbortSignal.timeout(180000),headers:{Authorization:`Bearer ${token()}`,'Content-Type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{inlineData:{mimeType:'image/png',data:b64(path.join(DIR,'bas',n+'.png'))}},...(s.civil?[]:[{inlineData:{mimeType:'image/png',data:b64(path.join(DIR,'bas','m90-tyg.png'))}}]),{text:prompt(n,s)}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:'9:16'}}})});
  if(r.status===401){tok=null;continue}
  if(r.status===429||r.status>=500){await vanta(Math.min(30000*f,180000));continue}
  const j=await r.json();const p=j.candidates?.[0]?.content?.parts?.find(x=>x.inlineData);
  if(!p){console.log(n,id,'tomt',r.status,j.candidates?.[0]?.finishReason||'');await vanta(5000);continue}
  fs.writeFileSync(path.join(DIR,n,id+'.png'),Buffer.from(p.inlineData.data,'base64'));M[n+'/'+id]=s;fs.writeFileSync(manifest,JSON.stringify(M,null,1));
  klara++;if(klara%10===0||jobb.length<10)console.log(new Date().toTimeString().slice(0,8),'klara',klara,'av',jobb.length);return}
  catch(e){await vanta(15000)}}
 fel++;console.log(n,id,'GAV UPP');
}
let pos=0;await Promise.all(Array.from({length:PAR},async()=>{while(pos<jobb.length){const j=jobb[pos++];await en(j);await vanta(3000)}}));
console.log('SLUT klara',klara,'fel',fel);
