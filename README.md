# marketing-media
Publikt mediavärdskap för Sand och Berg HB:s schemalagda inlägg (Metricool läser filerna härifrån).

## Ordning
`<projekt>/<format>/`, och `instagram/` och `tiktok/` under formatet när plattformarna har olika versioner. Filer som passar båda, som 9:16-videor, ligger direkt i formatmappen.

Namn som börjar med nummer och datum sorteras i publiceringsordning: `001_2026-11-07_papklipp`. Äldre batcher har batchens datum först.

## Projekten
Mappnamnet är appens nyckel i Marketing, med två undantag: `normo` är HPHome och `forsvarets-dag` är Försvarets Dag (`forsvaretsdag`). Mappningen bor i `core/media.js` (`projektFor`).

| Mapp | App |
|---|---|
| `matteappen`, `integro-norge`, `integro-osterrike` | Integro (Sverige, Norge, Österrike) |
| `normo` | HPHome |
| `monstringsappen` | Mönstringsappen |
| `sesjontester`, `kutsunnat`, `musterung`, `stellung`, `aushebung`, `forsvarets-dag` | systerapparna: Norge, Finland, Tyskland, Österrike, Schweiz, Danmark |
| `polistull` | Polis- och Tullappen |
| `aso`, `ovrigt` | bara arkiv |

## Två specialmappar
- **`<projekt>/kallbilder/`** är inga inlägg. Det är stora källbilder som generatorerna i Marketing läser, med samma sökvägar som under `apps/<app>/tiktok/`. Hämta dem till rätt plats med `node scripts/hamta-media.js --kallbilder <app>`.
- **`<projekt>/arkiv/`** är det som bara fanns lokalt när Marketing städades 2026-11-09: opublicerade renderingar, gamla batcher och ASO-rådata, i sin ursprungliga sökväg. Inget här är schemalagt.

## Lokalt
Klona aldrig hela repot. `bash scripts/klona-latt.sh` i Marketing gör en gles klon där git vet om varje fil men ingen ligger på disk. Hämta det du behöver med `node scripts/hamta-media.js <sökväg>`, och börja om med `--rensa`. Uppladdarna i Marketing pushar hit via en tillfällig klon, så den lokala förblir liten.
