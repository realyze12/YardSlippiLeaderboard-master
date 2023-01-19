import { getPlayerDataThrottled } from './slippi'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as syncFs from 'fs';
import * as path from 'path';
import util from 'util';
import * as settings from '../settings'

import { exec } from 'child_process';
const fs = syncFs.promises;
const execPromise = util.promisify(exec);

var playerCodes = new Set(["ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0",
  "TORI#670","DUBL#605","MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666",
  "MANG#471","MRBS#254","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0",
  "TORI#670","DUBL#605","MAJ#114","QUAI#496","ASHE#873","AAAA#445","DANG#139","KZR#171","MINE#788","PORK#582",
  "POG#781", "DELU#475",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","DANG#139","KZR#171","MINE#788","PORK#582", "LUD#628",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474",
  "BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474",
  "BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","DANG#139","KZR#171",
  "MINE#788","PORK#582","ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0",
  "TORI#670","DUBL#605","MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666",
  "MANG#471","MRBS#254","OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265",
  "MAMBO#5","GLTR#474","BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250",
  "CHRO#286","GREY#820","QUEST#0","HADE#334","DANG#139","KZR#171","MINE#788","PORK#582", "NERO#441",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474",
  "BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820",
  "QUEST#0","HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474",
  "BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820",
  "QUEST#0","HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","GON#569","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605","MAJ#114",
  "QUAI#496","ASHE#873","AAAA#445","","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254","OSCI#276",
  "OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474","BROC#894",
  "RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820","QUEST#0",
  "HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","DANG#139","KZR#171",
  "MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605","MAJ#114",
  "QUAI#496","ASHE#873","AAAA#445","","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254","OSCI#276",
  "OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474","BROC#894",
  "RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820","QUEST#0",
  "HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","ROSC#837","REAL#154",
  "DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474",
  "BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820",
  "QUEST#0","HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","ROSC#837",
  "REAL#154","ABSU#168","COLM#1","DANG#139","KZR#171","MINE#788","PORK#582","ROSE#554","LUDW#318","AVIV#825",
  "NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605","MAJ#114","QUAI#496","ASHE#873",
  "AAAA#445","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254","OSCI#276","OSCI#276","PERC#401",
  "THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474","BROC#894","RARE#790","LUD#628",
  "CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820","QUEST#0","HADE#334","NERO#441",
  "RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","ROSC#837","REAL#154","ABSU#168","COLM#1",
  "DANG#139","KZR#171","MINE#788","PORK#582", "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851",
  "MKOA#756","FREE#0","TORI#670","DUBL#605","MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475",
  "GG#288","SICK#666","MANG#471","MRBS#254","OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467",
  "DAGM#527","FOST#265","MAMBO#5","GLTR#474","BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303",
  "SINN#523","DRGT#250","CHRO#286","GREY#820","QUEST#0","HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124",
  "GON#569","SKIB#239","IIII#143","ROSC#837","REAL#154","ABSU#168","COLM#1","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605","MAJ#114",
  "QUAI#496","ASHE#873","AAAA#445","","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254","OSCI#276",
  "OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474","BROC#894","RARE#790",
  "LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820","QUEST#0","HADE#334","NERO#441",
  "RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","ROSC#837","REAL#154","ABSU#168","COLM#1","BOR#770",
  "SEAG#871","RYKL#626","PMAN#981","PICH#444","FIXI#540","SEAN#230","DANG#139","KZR#171","MINE#788","PORK#582",
  "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851","MKOA#756","FREE#0","TORI#670","DUBL#605",
  "MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288","SICK#666","MANG#471","MRBS#254",
  "OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265","MAMBO#5","GLTR#474",
  "BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286","GREY#820",
  "QUEST#0","HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","ROSC#837",
  "REAL#154","ABSU#168","COLM#1","BOR#770","SEAG#871","RYKL#626","PMAN#981","PICH#444","FIXI#540","SEAN#230",
  "DANG#139","KZR#171","MINE#788","PORK#582", "ROSE#554","LUDW#318","AVIV#825","NULL#620","ETB#104","TROZ#851",
  "MKOA#756","FREE#0","TORI#670","DUBL#605","MAJ#114","QUAI#496","ASHE#873","AAAA#445","MANG#471","DELU#475","GG#288",
  "SICK#666","MANG#471","MRBS#254","OSCI#276","OSCI#276","PERC#401","THU#642","ICEG#999","XAVI#467","DAGM#527","FOST#265",
  "MAMBO#5","GLTR#474","BROC#894","RARE#790","LUD#628","CHES#401","SEAMUS#1","YING#303","SINN#523","DRGT#250","CHRO#286",
  "GREY#820","QUEST#0","HADE#334","NERO#441","RAM#627","QWER#355","DUCK#124","GON#569","SKIB#239","IIII#143","ROSC#837",
  "REAL#154","ABSU#168","COLM#1","BOR#770","SEAG#871","RYKL#626","PMAN#981","PICH#444","FIXI#540","SEAN#230","ASH#972",
  "DANG#139","KZR#171","MINE#788","PORK#582"


]);

var playerCodes2 = Array.from(playerCodes);

const getPlayerConnectCodes = async (): Promise<string[]> => {
  // const doc = new GoogleSpreadsheet(settings.spreadsheetID);
  // await doc.useServiceAccountAuth(creds);
  // await doc.loadInfo(); // loads document properties and worksheets
  // const sheet = doc.sheetsByIndex[0];
  // const rows = (await sheet.getRows()).slice(1); // remove header row
  return playerCodes2;
};

const getPlayers = async () => {
  const codes = await getPlayerConnectCodes()
  console.log(`Found ${codes.length} player codes`)
  const allData = codes.map(code => getPlayerDataThrottled(code))
  const results = await Promise.all(allData.map(p => p.catch(e => e)));
  const validResults = results.filter(result => !(result instanceof Error));
  const unsortedPlayers = validResults
    .filter((data: any) => data?.data?.getConnectCode?.user)
    .map((data: any) => data.data.getConnectCode.user);
  return unsortedPlayers.sort((p1, p2) =>
    p2.rankedNetplayProfile.ratingOrdinal - p1.rankedNetplayProfile.ratingOrdinal)
}

async function main() {
  console.log('Starting player fetch.');
  const players = await getPlayers();
  if(!players.length) {
    console.log('Error fetching player data. Terminating.')
    return
  }
  console.log('Player fetch complete.');
  // rename original to players-old
  const newFile = path.join(__dirname, 'data/players-new.json')
  const oldFile = path.join(__dirname, 'data/players-old.json')
  const timestamp = path.join(__dirname, 'data/timestamp.json')

  await fs.rename(newFile, oldFile)
  console.log('Renamed existing data file.');
  await fs.writeFile(newFile, JSON.stringify(players));
  await fs.writeFile(timestamp, JSON.stringify({updated: Date.now()}));
  console.log('Wrote new data file and timestamp.');
  console.log('Deploying.');
  const rootDir = path.normalize(path.join(__dirname, '..'))
  console.log(rootDir)
  // if no current git changes
  const { stdout, stderr } = await execPromise(`git -C ${rootDir} status --porcelain`);
  if(stdout || stderr) {
    console.log('Pending git changes... aborting deploy');
    return
  }
  const { stdout: stdout2, stderr: stderr2 } = await execPromise(`npm run --prefix ${rootDir} deploy`);
  console.log(stdout2);
  if(stderr2) {
    console.error(stderr2);
  }
  console.log('Deploy complete.');
}

main();
