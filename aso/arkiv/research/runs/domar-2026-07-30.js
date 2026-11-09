#!/usr/bin/env node
// research/runs/domar-2026-07-30.js — skriver verdicts.json för nattkörningen.
//
//   node research/runs/domar-2026-07-30.js
//
// Varför ett skript och inte handskriven JSON: nischnamnen kommer från Apple
// och kan bära osynliga tecken (zero-width). report.js stoppar körningen på
// ett namn som inte matchar — helt rätt, men då vill man inte sitta och leta
// efter vilket tecken som skiljer. Här slås namnen upp i scores.json på en
// normaliserad form, och det EXAKTA namnet skrivs ut. Ett uppslag som inte
// träffar avbryter direkt, med förslag på närmaste nisch.

const fs = require('fs');
const path = require('path');
const { closestMatch, normalizeTerm } = require('../lib/util');

const RUNS = path.join(__dirname);
const nyckel = s => normalizeTerm(s).toLowerCase();

// ─────────────────────────── SVERIGE ───────────────────────────
const SE = [
  ['skepparexamen', 'KOR', {
    motivering: 'Den enda nischen i körningen med BEVISAD betalvilja och en trött marknadsledare. Båtkörkortet tar 129 kr och har 166 recensioner men uppdaterades senast 2024-04-01 — två år gammal. NFB Båtintyg är förarintygets egen organisation, tar 99 kr och ligger på 3,1. Sex träffar totalt i hela sökresultatet.',
    byggbarhet: 'Ja. Frågebank plus provsimulering är exakt Mönstringsappens mall. Kunskapsfordringarna för förarintyg är publicerade av NFB, så innehållet går att strukturera utan att kopiera någon annans frågor — de måste skrivas av oss.',
    innehallskalla: 'NFB:s kunskapsfordringar för förarintyg och kustskepparintyg (publika). Sjövägsregler och lanternor är författningstext. Frågorna skriver vi själva.',
    betalvilja: 'Bevisad: två konkurrenter tar 99 respektive 129 kr och den dyrare har 166 recensioner. Förarintyget kostar flera tusen kronor i kursavgift, så en app på hundralappen är en marginell utgift för den som ändå ska ta det.',
    risk43: 'Låg. Ingen av våra befintliga appar rör sjöfart.',
    konkurrentsvaghet: 'Ledaren är två år gammal. Organisationens egen app ligger på 3,1. Ingen har ett modernt gränssnitt eller provsimulering med statistik.',
    kandidat: 'forarintyg',
  }],
  ['brandfarliga heta arbeten', 'KANSKE', {
    motivering: 'Tunnaste konkurrensen i hela den svenska körningen — EN app, 17 recensioner, 3,6. Men samtliga appar i nischen är gratis, och certifikatet kräver en kurs med lärarledd examination. Man kan inte plugga sig till behörigheten, och arbetsgivaren betalar kursen. Ingen har visat att någon vill betala för en app här.',
    byggbarhet: 'Ja, tekniskt trivialt.',
    innehallskalla: 'Brandskyddsföreningens och SVEBRA:s regelverk är publika.',
    betalvilja: 'Obevisad, och det är invändningen. Alla konkurrenter är gratis.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'En enda app, medelmåttigt betyg.',
  }],
  ['korsord hjälp', 'KANSKE', {
    motivering: 'Lägsta svårigheten i körningen (7). Korsordshjälp har 113 recensioner, tvåan har 4. Ett verktyg som löser mönster i en svensk ordlista är byggbart på några dagar och har en tydlig, återkommande användning.',
    byggbarhet: 'Ja, men kräver en fri svensk ordlista med böjningsformer och en snabb mönstersökning. En extra dags arbete med datat.',
    innehallskalla: 'Fria ordlistor (DSSO, Folkets lexikon). Licenserna måste läsas innan något byggs.',
    betalvilja: 'Osäker. Korsordslösare är en klassisk engångsköpsprodukt, men målgruppen är äldre och priskänslig.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Ledaren är ensam; allt under henne har enstaka recensioner.',
  }],
  ['ränta på ränta: sparkalkylator', 'KANSKE', {
    motivering: 'Högsta möjlighetspoängen i körningen (71) och bara två konkurrenter, med 1 respektive 5 recensioner. Men en kalkylator är svår att ta betalt för, och nischnamnet är i sig en apptitel — signalen kan vara ekot av en svag app snarare än en efterfrågan.',
    byggbarhet: 'Ja, en dag.',
    innehallskalla: 'Ingen — ren räknelogik.',
    betalvilja: 'Svag. Gratis kalkylatorer finns överallt, även i Google.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Två appar, båda utan fäste.',
  }],
  ['tidrapportering', 'KANSKE', {
    motivering: 'Körningens starkaste efterfrågan (100) och samma splittrade marknad som i går: 7, 9, 26 och 57 recensioner i toppen. Vi har redan byggt appen — Timmar ligger i Documents/Projekt/Timmar och väntar på inskick. Nischen är alltså inte ledig, den är påbörjad.',
    byggbarhet: 'Redan byggd.',
    innehallskalla: 'Kollektivavtalens OB-tider, verifierade i juli 2026.',
    betalvilja: 'Oprövad — appen är gratis i dag.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Ingen konkurrent räknar OB, bara timmar.',
  }],
  ['läsförståelse', 'KANSKE', {
    motivering: 'Fortfarande samma bild som i går: svag konkurrens men ett rörigt sökresultat där snabbläsning, HP-coach och dyslexityposnitt blandas. Ingen äger begreppet — eller så söker för få det för att någon ska bry sig.',
    byggbarhet: 'Ja, men innehållet är texter plus frågor, alltså verklig produktion.',
    innehallskalla: 'Egenproducerade texter, eller public domain.',
    betalvilja: 'Osäker.',
    risk43: 'Gränsar till HPHome och Integro.',
    konkurrentsvaghet: 'Ingen med fäste.',
  }],
  ['min biodling', 'KANSKE', {
    motivering: 'Liten men engagerad målgrupp, alla konkurrenter under 30 recensioner. En kupdagbok är enkel att bygga och har en säsong som återkommer varje år. Frågan är fortfarande om marknaden är stor nog för att synas i intäkterna.',
    byggbarhet: 'Ja, ren loggbok.',
    innehallskalla: 'Ingen.',
    betalvilja: 'Biodlare köper utrustning för tusenlappar, så en app på hundralappen är rimlig.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Fyra appar, ingen över 30 recensioner.',
  }],
  ['lavinprognoser', 'KANSKE', {
    motivering: 'Nästan ingen konkurrens, men prognoserna kommer från Naturvårdsverkets lavinprognoser och kräver löpande datainhämtning. Dessutom ett ansvar: en app som visar fel lavinfara kan bidra till att någon dör.',
    byggbarhet: 'Kräver dataintegration, inte bara innehåll.',
    innehardskalla: 'Naturvårdsverket.',
    innehallskalla: 'Naturvårdsverkets lavinprognoser.',
    betalvilja: 'Osäker.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Två appar utan recensioner.',
  }],
  ['ivt värmepump', 'KANSKE', {
    motivering: 'Ovanligt tydlig missnöjd marknad: IVT Anywhere II har 521 recensioner på 2,9 och IVT Anywhere 130 på 1,4. Men det är tillverkarens egna appar som styr hårdvaran — vi kan inte bygga en ersättare utan deras API.',
    byggbarhet: 'Nej, inte utan tillverkarens gränssnitt.',
    innehallskalla: 'Saknas.',
    betalvilja: 'Irrelevant.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Uselt betyg, men inlåst bakom hårdvaran.',
  }],
  ['stegräknare widget', 'SKIPPA', { motivering: 'Apple Health räknar redan steg och visar dem i en widget. Det finns ingen lucka.' }],
  ['teoriprov för jägarexamen', 'SKIPPA', { motivering: 'Jägarexamen har 5025 recensioner på 4,8 och säljs för 349 kr. Nischen är tagen av en app som är både etablerad och omtyckt.' }],
  ['naturvårdsverket teoriprov', 'SKIPPA', { motivering: 'Samma jägarexamenskluster. Huvudappen dominerar hela nischen.' }],
  ['svensk teckenspråkslexikon', 'SKIPPA', { motivering: 'Hög efterfrågan och missnöjd marknad, men ett teckenspråkslexikon kräver filmade tecken. Fel sorts innehållsproduktion för oss.' }],
  ['korsord svenska lätt', 'SKIPPA', { motivering: 'Ledarna har 793, 294 och 160 recensioner på 4,1–4,6. Ingen lucka.' }],
  ['teoriprov mc', 'SKIPPA', { motivering: 'iKörkort MC har 3105 recensioner och Ta Körkort 32 018. Körkortsteori är den hårdaste svenska nischen som finns.' }],
  ['skanna qr kod gratis', 'SKIPPA', { motivering: 'iOS skannar QR-koder inbyggt i kameran, och QR Reader har 36 589 recensioner.' }],
  ['valutaomvandlare valutakurser*', 'SKIPPA', { motivering: 'Ledaren har 5406 recensioner på 4,7. Dessutom kräver valutakurser löpande data.' }],
  ['interrail eurail', 'SKIPPA', { motivering: 'Omio har 19 934 recensioner och de officiella apparna äger nischen. Tågdata är dyr att hålla färsk.' }],
  ['körjournal från driversnote', 'SKIPPA', { motivering: 'Nischnamnet är en apptitel. Driversnote har 2008 recensioner på 4,6.' }],
  ['glutenfritt', 'SKIPPA', { motivering: 'Kräver en produktdatabas med streckkoder som måste hållas färsk. eatersmap har 386 recensioner, Find Me Gluten Free 147.' }],
  ['kaloriräknare och matspårare', 'SKIPPA', { motivering: 'Marknaden är full av AI-kaloriräknare med bildigenkänning. Fel teknikhöjd för oss.' }],
  ['orientering karta', 'SKIPPA', { motivering: 'Kräver kartdata och GPS-lager. Tyngre än vi klarar på rimlig tid.' }],
  ['radon eye', 'SKIPPA', { motivering: 'Nischnamnet är en apptitel för en hårdvarumätare. Ingen app utan mätaren.' }],
  ['2ma körjournal', 'SKIPPA', { motivering: 'Nischnamnet är en apptitel utan recensioner — ett rent appnamnseko, inte en sökning.' }],
  ['svensk innebandy', 'SKIPPA', { motivering: 'Förbundets officiella app har 858 recensioner på 1,8. Missnöjd marknad, men matchdata ägs av förbundet.' }],
  ['sluta röka gratis', 'SKIPPA', { motivering: 'Delfrasen är öppen men huvudnischen domineras av Rökfri. Beteendeförändring kräver dessutom mer än en räknare för att ge värde.' }],
  ['tyska stater - geografi quiz', 'SKIPPA', { motivering: 'En app med två recensioner. Marknaden är för liten för att synas.' }],
  ['usa städer & huvudstäder', 'SKIPPA', { motivering: 'Samma sak: geografiquiz utan urskiljbar efterfrågan.' }],
  ['3d-animerade akvarium', 'SKIPPA', { motivering: 'Nischnamnet är en apptitel. Bakgrundsbilder är inte vår sorts produkt.' }],
  ['veganskt och fika i skåne ab', 'SKIPPA', { motivering: 'Apptitel, inte en sökfras. Lokal restaurangguide kräver löpande redaktionellt arbete.' }],
];

// ─────────────────────────── NORGE ───────────────────────────
const NO = [
  ['varme arbeider', 'KANSKE', {
    motivering: 'Samma bild som den svenska heta arbeten-nischen: åtta appar, ingen med fäste (2 och 2 recensioner i toppen). Certifieringen kräver kurs med examination, och alla appar är gratis. Intressant först om betalviljan visar sig i Sverige.',
    byggbarhet: 'Ja.', innehallskalla: 'Norsk brandskyddsförenings regelverk.',
    betalvilja: 'Obevisad — alla konkurrenter gratis.', risk43: 'Låg.',
    konkurrentsvaghet: 'Ingen app har fäste.',
  }],
  ['naaf pollenvarsel', 'SKIPPA', { motivering: 'Pollenprognosen kommer från NAAF och kräver löpande datainhämtning från deras mätstationer. Inget vi kan äga.' }],
  ['skredvarsel', 'SKIPPA', { motivering: 'Varsom är NVE:s officiella app. Skredvarsel är myndighetsdata med ansvarsfrågor.' }],
  ['jegerprøveneksamen', 'SKIPPA', { motivering: 'Jegerappen har 5953 recensioner på 4,7. Nischen är tagen.' }],
  ['jegerprøven', 'SKIPPA', { motivering: 'Samma kluster, samma dominerande app.' }],
  ['teoriprøven gratis', 'SKIPPA', { motivering: 'Teoriprøven – bil har 1532 recensioner på 4,6. Körkortsteori är tagen i Norge också.' }],
  ['menstruasjonskalender gratis', 'SKIPPA', { motivering: 'Flo har 21 776 recensioner och Clue 4343. Global kategori med enorma aktörer.' }],
  ['søvndagbok', 'SKIPPA', { motivering: '46 appar och ingen tydlig lucka. Sömndagbok är en global kategori.' }],
  ['matdagbok kalorier måltider', 'SKIPPA', { motivering: 'Kaloriräkning är samma globala kategori som i Sverige, med AI-appar överallt.' }],
  ['gangetabellen', 'SKIPPA', { motivering: 'Multiplikationstabeller har 30 appar och ledare med hundratals recensioner. Ingen språkfördel eftersom siffror är samma överallt.' }],
  ['hekling', 'SKIPPA', { motivering: 'Virkning är en global kategori; YarnPal har 321 recensioner och Hobbii 170.' }],
  ['timeliste', 'SKIPPA', { motivering: 'Samma nisch som Timmar, men på en marknad en femtedel så stor. Ta Sverige först.' }],
];

// ─────────────────────────── DANMARK ───────────────────────────
const DK = [
  ['medborgerskabsprøven', 'KOR', {
    motivering: 'Körningens tydligaste fynd. Danmark har TVÅ obligatoriska prov — indfødsretsprøven för medborgarskap och medborgerskabsprøven för permanent uppehållstillstånd — och ingen app har fäste i någondera. Bästa konkurrenten har 4 recensioner. Vi har redan byggt exakt den här appen för Sverige, så bygget är en port och inte ett nytt projekt.',
    byggbarhet: 'Ja, och billigast av allt i körningen: Medborgarskapsprovets struktur, lektioner, quiz och provsimulering finns redan. Det som byts ut är innehållet och språket.',
    innehallskalla: 'Undervisningsministeriets läromedel till indfødsretsprøven är publikt, liksom tidigare provfrågor. Materialet är på danska och måste läsas av någon som kan språket — det är projektets verkliga kostnad.',
    betalvilja: 'Samma som i Sverige: provet är obligatoriskt för medborgarskap, avgiftsbelagt, och ges två gånger om året. Den som missar väntar ett halvår. Det är precis den situation där folk betalar för att plugga rätt.',
    risk43: 'Reell och måste hanteras. Medborgarskapsprovet finns redan i vårt konto, och Apple avvisar appar som bara byter innehåll i samma skal. En dansk app måste vara en egen produkt med eget namn, egna skärmbilder och eget innehåll — inte en lokalisering av den svenska.',
    konkurrentsvaghet: 'Sex appar, den bästa har fyra recensioner. Ingen har en fullständig frågebank för båda proven.',
    kandidat: 'indfodsretsproven',
  }],
  ['jagtprøve', 'KANSKE', {
    motivering: 'Bara EN app i sökresultatet — Jægerappen med 129 recensioner på 4,4. Danska jagttegn tas av tusentals varje år. Betydligt svagare konkurrens än den svenska jägarexamen, där ledaren har 5025 recensioner.',
    byggbarhet: 'Ja, samma mall som förarintyg.',
    innehallskalla: 'Naturstyrelsens jagtprøve-material är publikt. Artkännedom kräver bilder — det är arbetet.',
    betalvilja: 'Sannolik: jagttegn kostar kursavgift, och svenska motsvarigheten säljs för 349 kr.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'En ensam app med gott men inte överväldigande fäste.',
  }],
  ['varmt arbejde', 'KANSKE', {
    motivering: 'En app, DBI Certifikater, med tre recensioner. Samma nisch som den svenska och norska heta arbeten — och samma invändning: kursen är obligatorisk och betalas av arbetsgivaren.',
    byggbarhet: 'Ja.', innehallskalla: 'DBI:s regelverk.',
    betalvilja: 'Obevisad.', risk43: 'Låg.', konkurrentsvaghet: 'Praktiskt taget ingen konkurrent.',
  }],
  ['teoriprøver gratis', 'KANSKE', {
    motivering: 'Ovanligt: den danska körkortsteorin har en betydligt svagare ledare än den svenska och norska. Teoriprøven - bil har 121 recensioner mot iKörkorts 3105. Tio fraser i klustret, alltså bred efterfrågan. Men körkortsteori kräver aktuella vägmärken och regeländringar, och innehållsmängden är stor.',
    byggbarhet: 'Ja, men den största innehållsproduktionen av alla kandidater.',
    innehallskalla: 'Færdselsstyrelsens material.',
    betalvilja: 'Bevisad i alla nordiska länder.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Ledaren har bara 121 recensioner — svagast i Norden.',
  }],
  ['digital jagttegn', 'SKIPPA', { motivering: 'Missnöjd marknad (2,6 och 2,1 i betyg) men "digitalt jagttegn" är den officiella licensen som visas upp vid kontroll. Det är en myndighetsfunktion vi inte kan bygga.' }],
  ['mit fisketegn', 'SKIPPA', { motivering: 'Samma sak — det officiella fiskekortet, utfärdat av staten.' }],
  ['dit digitale vaccinationskort', 'SKIPPA', { motivering: 'Vaccinationsdata ligger hos sundhed.dk. Min Læge har 5152 recensioner.' }],
  ['maddagbog kalorier måltider', 'SKIPPA', { motivering: 'Kaloriräkning, global kategori.' }],
  ['menstruationskalender: raheva', 'SKIPPA', { motivering: 'Apptitel, inte en sökfras. Perioduppföljning ägs globalt av Flo och Clue.' }],
  ['hækling', 'SKIPPA', { motivering: 'Virkning, global kategori.' }],
  ['engelsk grammatik', 'SKIPPA', { motivering: '44 appar och ingen språkfördel — engelsk grammatik lärs ut likadant överallt.' }],
  ['jægerappen - jagttegn artsquiz', 'SKIPPA', { motivering: 'Apptitel, inte en sökfras. Ekot av konkurrenten i jagtprøve-nischen.' }],
];

// ─────────────────────────── GLOBALT (US) ───────────────────────────
// Genomgången gav ett tydligt svar: den amerikanska butiken har en etablerad
// ledare med tusentals recensioner i VARJE nisch vi hittade. Det är inte ett
// gnälligt omdöme utan vad datan säger — högsta möjlighetspoängen i hela
// US-körningen är 52, mot 71 i den svenska. Låg efterfrågan är inte problemet;
// mättnad är.
const US = [
  ['hvac load calculator', 'KANSKE', {
    motivering: 'Den enda amerikanska nischen där ingen konkurrent har fäste: HVAC Load Calculator Manual J har 32 recensioner, resten under 6. Manual J-beräkning är dessutom en avgränsad räkneuppgift med en publicerad standard, inte en innehållsproduktion.',
    byggbarhet: 'Ja, men standarden (ACCA Manual J) är upphovsrättsskyddad och måste licensieras eller implementeras från de publika delarna. Juridiken före koden.',
    innehallskalla: 'ACCA Manual J — licensfråga.',
    betalvilja: 'God: verktyget används yrkesmässigt av installatörer, och yrkesverktyg tål prissättning.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Ingen app i nischen har fler än 32 recensioner.',
  }],
  ['pet medication reminder', 'KANSKE', {
    motivering: 'Fyra av de fem översta har noll recensioner, trots att 48 appar rankar. Antingen är det ett glapp eller en kategori ingen tjänar pengar på — samma osäkerhet som "cv mall gratis" i den svenska körningen.',
    byggbarhet: 'Ja, ren påminnelselogik.',
    innehallskalla: 'Ingen.',
    betalvilja: 'Osäker. Medisafe (100 787 recensioner) täcker människor gratis.',
    risk43: 'Låg.',
    konkurrentsvaghet: 'Ingen av de nischspecifika apparna har någon recension alls.',
  }],
  ['faa part 107 — practice test', 'SKIPPA', { motivering: 'Ledaren har 1924 recensioner på 4,8 och tvåan 968. Nischnamnet är dessutom en apptitel.' }],
  ['servsafe practice test prep •', 'SKIPPA', { motivering: 'Fyra appar med 999, 1501 och 647 recensioner, alla på 4,9. Fullständigt mättat.' }],
  ['cna practice test 2026 prep', 'SKIPPA', { motivering: '2159, 1879 och 890 recensioner på 4,8–4,9. Mättat.' }],
  ['ati teas test prep 2026.', 'SKIPPA', { motivering: 'Official ATI TEAS Prep har 7781 recensioner. Officiella provgivaren är själv på plats.' }],
  ['free sales tax calculator', 'SKIPPA', { motivering: '5417 och 2515 recensioner på 4,8. En räknare med den etableringen tas inte.' }],
  ['free car loan calculator', 'SKIPPA', { motivering: 'Loan Calculator har 104 247 recensioner.' }],
  ['paycheck calculator free', 'SKIPPA', { motivering: '12 585 och 13 889 recensioner i toppen.' }],
  ['migraine diary free', 'SKIPPA', { motivering: 'Migraine Buddy har 41 082 recensioner på 4,8. En av de mest etablerade hälsoapparna som finns.' }],
  ['server tip tracker free', 'SKIPPA', { motivering: '9406 och 9323 recensioner. Mättat.' }],
  ['fishing knots free', 'SKIPPA', { motivering: 'Fishing Knots FishPlanet har 19 603 recensioner.' }],
  ['5/3/1 workout logger', 'SKIPPA', { motivering: 'Strong Workout Tracker har 108 475 recensioner. Träningsloggar är den mest mättade kategorin i App Store.' }],
  ['habit tracker grid', 'SKIPPA', { motivering: 'everyday har 4487 och HabitKit 2290 recensioner.' }],
  ['mood tracker bpd', 'SKIPPA', { motivering: 'Daylio har 60 839 recensioner. Dessutom kräver psykiatrinära appar omsorg vi inte kan ge på två dagar.' }],
  ['the medication reminder арр', 'SKIPPA', { motivering: 'Medisafe har 100 787 recensioner. Nischnamnet innehåller dessutom kyrilliska tecken — ett appnamnseko, inte en sökning.' }],
  ['chess opening trainer', 'SKIPPA', { motivering: 'Chessable (5819) och Chessbook (1967) ägs av schackvärldens etablerade aktörer.' }],
  ['iverbs irregular verbs english', 'SKIPPA', { motivering: 'Apptitel med 3259 recensioner.' }],
  ['morse code practice', 'SKIPPA', { motivering: 'Morse Mania har 8032 recensioner på 4,9.' }],
  ['seizure diary', 'SKIPPA', { motivering: 'Epsy har 1668 recensioner, och epilepsiloggar är medicinskt känsliga.' }],
  ['cross stitch pattern keeper', 'SKIPPA', { motivering: 'Markup R-XP har 2739 och Stitchly 2055 recensioner.' }],
  ['solar panel calculator plus', 'SKIPPA', { motivering: 'Sun position and path har 1842 recensioner; solberäkning kräver dessutom platsdata.' }],
];

const KORNINGAR = {
  '2026-07-30-se': SE,
  '2026-07-30-no': NO,
  '2026-07-30-dk': DK,
  '2026-07-30-us': US,
};

let fel = 0;
for (const [run, domar] of Object.entries(KORNINGAR)) {
  const dir = path.join(RUNS, run);
  const scores = JSON.parse(fs.readFileSync(path.join(dir, 'scores.json'), 'utf8'));
  const karta = new Map(scores.niches.map(n => [nyckel(n.name), n.name]));

  const niches = [];
  for (const [namn, verdict, extra] of domar) {
    const exakt = karta.get(nyckel(namn));
    if (!exakt) {
      const nara = closestMatch(nyckel(namn), [...karta.keys()]);
      console.error(`❌ ${run}: "${namn}" finns inte i scores.json. Närmast: "${nara}"`);
      fel++;
      continue;
    }
    niches.push({ name: exakt, verdict, ...extra });
  }

  if (fel) continue;
  fs.writeFileSync(path.join(dir, 'verdicts.json'),
    JSON.stringify({ niches, forslag: null }, null, 2) + '\n');
  const raknare = niches.reduce((a, n) => ({ ...a, [n.verdict]: (a[n.verdict] || 0) + 1 }), {});
  console.log(`✅ ${run}: ${niches.length} domar av ${scores.niches.length} nischer` +
    `  (${Object.entries(raknare).map(([k, v]) => `${v} ${k}`).join(', ')})`);
}

if (fel) { console.error(`\n❌ ${fel} namn matchade inte — inget skrevs för de körningarna.`); process.exit(1); }
