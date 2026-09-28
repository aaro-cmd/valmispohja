// Document templates. Shared by the browser (app.js) and the page builder (build.js).
// Each field: { id, label, type?, placeholder?, def?, help?, optional? }
// render(v) returns the document body as plain text; v holds field values.

function fiDate(iso) {
  if (!iso) return '__.__.____';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${m}.${y}`;
}

function todayIso() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Huoneenvuokralaki 52 §: a tenant's notice period is one calendar month, counted from
// the last day of the month in which notice was given. So the lease ends on the last
// day of the following month.
function tenantEndDate(iso) {
  if (!iso) return '';
  const [y, m] = iso.split('-').map(Number);
  const end = new Date(y, m + 1, 0); // month index m is the following month
  const pad = n => String(n).padStart(2, '0');
  return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
}

const b = (s, fallback = '________________') => (s && String(s).trim()) || fallback;

const DOCS = [
  {
    slug: 'irtisanomisilmoitus',
    title: 'Irtisanomisilmoitus',
    h1: 'Irtisanomisilmoitus työpaikasta – ilmainen pohja',
    metaDescription: 'Tee työsopimuksen irtisanomisilmoitus minuutissa. Täytä lomake, esikatsele ja tallenna PDF:ksi. Ilmainen, eikä tietojasi tallenneta mihinkään.',
    intro: 'Kun irtisanoudut työpaikastasi, ilmoitus kannattaa tehdä kirjallisesti, jotta irtisanomisajan alkamispäivästä ei tule epäselvyyttä. Täytä kentät, niin ilmoitus on valmis tulostettavaksi tai lähetettäväksi.',
    fields: [
      { id: 'nimi', label: 'Nimesi' },
      { id: 'osoite', label: 'Osoitteesi', optional: true },
      { id: 'tyonantaja', label: 'Työnantaja (yritys)' },
      { id: 'esihenkilo', label: 'Vastaanottaja (esihenkilö)', optional: true },
      { id: 'pvm', label: 'Irtisanomispäivä', type: 'date', def: todayIso },
      { id: 'aika', label: 'Irtisanomisaika', type: 'select', options: ['14 päivää', '1 kuukausi', '2 kuukautta', 'ei irtisanomisaikaa (koeaika)'], help: 'Laki: työsuhde kestänyt enintään 5 vuotta = 14 päivää, yli 5 vuotta = 1 kuukausi, ellei työ- tai työehtosopimuksessa sovita muuta. Koeajalla ei ole irtisanomisaikaa.' },
      { id: 'viimeinen', label: 'Viimeinen työpäivä', type: 'date' },
      { id: 'paikka', label: 'Paikkakunta' },
    ],
    render: v => `${b(v.paikka)} ${fiDate(v.pvm)}

${b(v.tyonantaja)}${v.esihenkilo ? `\n${v.esihenkilo}` : ''}

IRTISANOMISILMOITUS

Irtisanon työsopimukseni ${b(v.tyonantaja)} kanssa ${fiDate(v.pvm)}.

${v.aika && v.aika.startsWith('ei') ? 'Työsuhteeni on koeajalla, joten se päättyy ilman irtisanomisaikaa.' : `Irtisanomisaikani on ${b(v.aika)}.`} Viimeinen työpäiväni on ${fiDate(v.viimeinen)}.

Pyydän, että lopputilini maksetaan työsuhteen päättyessä ja että saan kirjallisen työtodistuksen.

Ystävällisin terveisin


${b(v.nimi)}${v.osoite ? `\n${v.osoite}` : ''}`,
    faq: [
      ['Kuinka pitkä irtisanomisaika minulla on?', 'Työsopimuslain mukaan työntekijän irtisanomisaika on 14 päivää, jos työsuhde on kestänyt enintään viisi vuotta, ja kuukausi, jos se on kestänyt yli viisi vuotta. Työ- tai työehtosopimuksessa voidaan sopia toisin, joten tarkista oma sopimuksesi.'],
      ['Riittääkö sähköposti?', 'Laki ei vaadi tiettyä muotoa, mutta kirjallinen ilmoitus, esimerkiksi sähköposti tai allekirjoitettu paperi, on todiste irtisanomisen päivämäärästä.'],
      ['Mitä koeajalla?', 'Koeajalla kumpikin osapuoli voi purkaa työsopimuksen ilman irtisanomisaikaa.'],
    ],
  },
  {
    slug: 'vuokrasopimuksen-irtisanominen',
    title: 'Vuokrasopimuksen irtisanominen',
    h1: 'Vuokrasopimuksen irtisanominen – ilmainen pohja vuokralaiselle',
    metaDescription: 'Irtisano vuokrasopimus helposti. Pohja laskee sopimuksen päättymispäivän automaattisesti ja tallentuu PDF:ksi. Ilmainen.',
    intro: 'Vuokralaisen irtisanomisaika on yksi kuukausi, ja se lasketaan sen kalenterikuukauden viimeisestä päivästä, jona irtisanominen tehtiin. Tämä pohja laskee päättymispäivän puolestasi.',
    fields: [
      { id: 'vuokralaiset', label: 'Vuokralaisen nimi (tai nimet)' },
      { id: 'asunto', label: 'Vuokra-asunnon osoite' },
      { id: 'vuokranantaja', label: 'Vuokranantaja' },
      { id: 'pvm', label: 'Irtisanomispäivä', type: 'date', def: todayIso },
      { id: 'uusiosoite', label: 'Uusi osoitteesi', optional: true },
      { id: 'tili', label: 'Tilinumero vakuuden palautusta varten', placeholder: 'FI00 0000 0000 0000 00', optional: true },
      { id: 'puhelin', label: 'Puhelinnumero', optional: true },
      { id: 'paikka', label: 'Paikkakunta' },
    ],
    render: v => `${b(v.paikka)} ${fiDate(v.pvm)}

${b(v.vuokranantaja)}

VUOKRASOPIMUKSEN IRTISANOMINEN

Irtisanon vuokrasopimuksen, joka koskee asuntoa osoitteessa ${b(v.asunto)}.

Irtisanomisaika on yksi kuukausi, ja se alkaa irtisanomiskuukauden viimeisestä päivästä. Vuokrasopimus päättyy siten ${fiDate(tenantEndDate(v.pvm))}.

Sovitaan avainten palauttamisesta ja asunnon tarkastuksesta erikseen.${v.tili ? `\n\nPyydän palauttamaan vuokravakuuden tilille ${v.tili}.` : ''}${v.uusiosoite ? `\n\nUusi osoitteeni on ${v.uusiosoite}.` : ''}


${b(v.vuokralaiset)}${v.puhelin ? `\n${v.puhelin}` : ''}`,
    faq: [
      ['Milloin vuokrasopimus päättyy?', 'Kun vuokralainen irtisanoo toistaiseksi voimassa olevan sopimuksen, irtisanomisaika on kuukausi, joka lasketaan irtisanomiskuukauden viimeisestä päivästä. Esimerkiksi 10.3. tehty irtisanominen päättää sopimuksen 30.4.'],
      ['Voiko määräaikaisen sopimuksen irtisanoa?', 'Määräaikainen vuokrasopimus ei yleensä ole irtisanottavissa kesken kauden, ellei sopimuksessa ole sovittu toisin. Tarkista oma sopimuksesi.'],
      ['Tarvitaanko kaikkien vuokralaisten allekirjoitus?', 'Kun sopimuksessa on useampi vuokralainen, irtisanomisen on hyvä allekirjoittaa kaikkien.'],
    ],
  },
  {
    slug: 'valtakirja',
    title: 'Valtakirja',
    h1: 'Valtakirja – ilmainen pohja, tulosta tai tallenna PDF',
    metaDescription: 'Tee valtakirja nopeasti: postin nouto, pankkiasiat, viranomaisasiointi tai muu asia. Ilmainen pohja, joka tallentuu PDF:ksi.',
    intro: 'Valtakirjalla annat toiselle henkilölle oikeuden hoitaa asiaa puolestasi, esimerkiksi noutaa paketin tai asioida viranomaisen kanssa. Kirjoita asia mahdollisimman tarkasti.',
    fields: [
      { id: 'valtuuttaja', label: 'Valtuuttajan nimi (sinä)' },
      { id: 'valtuuttajahetu', label: 'Valtuuttajan syntymäaika tai henkilötunnus', optional: true },
      { id: 'valtuutettu', label: 'Valtuutetun nimi' },
      { id: 'valtuutettuhetu', label: 'Valtuutetun syntymäaika tai henkilötunnus', optional: true },
      { id: 'asia', label: 'Mitä valtuutettu saa tehdä?', type: 'textarea', placeholder: 'Esim. noutaa minulle osoitetun paketin Postista (lähetystunnus ...)' },
      { id: 'voimassa', label: 'Voimassa asti', type: 'date', optional: true },
      { id: 'pvm', label: 'Päivämäärä', type: 'date', def: todayIso },
      { id: 'paikka', label: 'Paikkakunta' },
    ],
    render: v => `VALTAKIRJA

Valtuutan ${b(v.valtuutettu)}${v.valtuutettuhetu ? ` (${v.valtuutettuhetu})` : ''} puolestani ja nimissäni:

${b(v.asia)}

${v.voimassa ? `Valtakirja on voimassa ${fiDate(v.voimassa)} asti.` : 'Valtakirja on voimassa toistaiseksi, kunnes peruutan sen.'}

${b(v.paikka)} ${fiDate(v.pvm)}


____________________________________
${b(v.valtuuttaja)}${v.valtuuttajahetu ? ` (${v.valtuuttajahetu})` : ''}

Todistavat (tarvittaessa):

____________________________________        ____________________________________
Nimi ja nimenselvennys                      Nimi ja nimenselvennys`,
    faq: [
      ['Tarvitaanko todistajia?', 'Tavallisesti ei. Jotkin tahot, kuten pankit tai kiinteistökaupat, voivat vaatia oman lomakkeensa tai todistajat, joten tarkista vaatimukset etukäteen.'],
      ['Tarvitaanko henkilötunnus?', 'Syntymäaika riittää usein, mutta henkilötunnus tunnistaa henkilön varmemmin. Älä lähetä henkilötunnusta suojaamattomassa sähköpostissa.'],
    ],
  },
  {
    slug: 'auton-kauppakirja',
    title: 'Auton kauppakirja',
    h1: 'Auton kauppakirja – ilmainen pohja yksityiskauppaan',
    metaDescription: 'Ilmainen auton ja muun ajoneuvon kauppakirja yksityishenkilöiden väliseen kauppaan. Täytä, tulosta kaksi kappaletta ja allekirjoita.',
    intro: 'Kun myyt tai ostat auton, moottoripyörän tai muun ajoneuvon yksityishenkilöltä, kirjallinen kauppakirja suojaa molempia. Tulosta kaksi kappaletta, yksi kummallekin.',
    fields: [
      { id: 'myyja', label: 'Myyjän nimi' },
      { id: 'myyjaosoite', label: 'Myyjän osoite ja puhelin', optional: true },
      { id: 'ostaja', label: 'Ostajan nimi' },
      { id: 'ostajaosoite', label: 'Ostajan osoite ja puhelin', optional: true },
      { id: 'ajoneuvo', label: 'Merkki ja malli', placeholder: 'Esim. Toyota Corolla 1.6' },
      { id: 'rekisteri', label: 'Rekisteritunnus' },
      { id: 'valmistenumero', label: 'Valmistenumero (VIN)', optional: true },
      { id: 'km', label: 'Mittarilukema (km)' },
      { id: 'hinta', label: 'Kauppahinta (€)' },
      { id: 'maksutapa', label: 'Maksutapa', type: 'select', options: ['käteisellä kaupanteon yhteydessä', 'tilisiirtona ennen luovutusta', 'MobilePaylla kaupanteon yhteydessä'] },
      { id: 'tiedossa', label: 'Myyjän tiedossa olevat viat', type: 'textarea', optional: true, placeholder: 'Esim. takapuskurissa naarmu, ilmastointi ei toimi' },
      { id: 'pvm', label: 'Kauppapäivä', type: 'date', def: todayIso },
      { id: 'paikka', label: 'Paikkakunta' },
    ],
    render: v => `AJONEUVON KAUPPAKIRJA

Myyjä: ${b(v.myyja)}${v.myyjaosoite ? `, ${v.myyjaosoite}` : ''}
Ostaja: ${b(v.ostaja)}${v.ostajaosoite ? `, ${v.ostajaosoite}` : ''}

Ajoneuvo: ${b(v.ajoneuvo)}
Rekisteritunnus: ${b(v.rekisteri)}${v.valmistenumero ? `\nValmistenumero: ${v.valmistenumero}` : ''}
Mittarilukema: ${b(v.km)} km

Kauppahinta: ${b(v.hinta)} euroa, maksetaan ${b(v.maksutapa)}.

Ajoneuvo luovutetaan ${fiDate(v.pvm)}. Omistus ja vastuu ajoneuvosta siirtyvät ostajalle luovutushetkellä.

Ostaja on tutustunut ajoneuvoon ja ostaa sen siinä kunnossa kuin se on kaupantekohetkellä. Myyjä on kertonut seuraavat tiedossaan olevat viat: ${b(v.tiedossa, 'ei tiedossa olevia vikoja')}.

Omistajanvaihdos ilmoitetaan Traficomille viipymättä. Myyjä ja ostaja vastaavat kumpikin omasta ilmoitusvelvollisuudestaan.

Tätä kauppakirjaa on tehty kaksi samasanaista kappaletta, yksi kummallekin osapuolelle.

${b(v.paikka)} ${fiDate(v.pvm)}


____________________________________        ____________________________________
${b(v.myyja, 'Myyjä').padEnd(44)}${b(v.ostaja, 'Ostaja')}`,
    faq: [
      ['Kuka tekee omistajanvaihdoksen ilmoituksen?', 'Sekä myyjällä että ostajalla on ilmoitusvelvollisuus. Ilmoituksen voi tehdä verkossa Traficomin palvelussa tai pankkitunnuksilla vakuutusyhtiön kautta.'],
      ['Mitä "siinä kunnossa kuin se on" tarkoittaa?', 'Ostaja hyväksyy ajoneuvon tarkastamansa kunnon. Myyjä vastaa silti vioista, jotka hän tiesi mutta jätti kertomatta, joten tiedossa olevat viat kannattaa kirjata kauppakirjaan.'],
    ],
  },
  {
    slug: 'reklamaatio',
    title: 'Reklamaatio',
    h1: 'Reklamaatio – valituspohja viallisesta tuotteesta',
    metaDescription: 'Tee reklamaatio viallisesta tuotteesta tai palvelusta. Ilmainen pohja kuluttajalle: vaadi korjausta, vaihtoa, hinnanalennusta tai kaupan purkua.',
    intro: 'Jos ostamasi tuote on viallinen, ilmoita virheestä myyjälle kohtuullisessa ajassa siitä, kun huomasit sen. Kirjallinen reklamaatio on paras todiste.',
    fields: [
      { id: 'nimi', label: 'Nimesi' },
      { id: 'yhteys', label: 'Sähköposti tai puhelin' },
      { id: 'myyja', label: 'Myyjä (yritys)' },
      { id: 'tuote', label: 'Tuote tai palvelu' },
      { id: 'ostopvm', label: 'Ostopäivä', type: 'date' },
      { id: 'hinta', label: 'Hinta (€)', optional: true },
      { id: 'tilaus', label: 'Tilaus- tai kuittinumero', optional: true },
      { id: 'virhe', label: 'Mikä on vialla?', type: 'textarea' },
      { id: 'vaatimus', label: 'Mitä vaadit?', type: 'select', options: ['virheen korjaamista', 'tuotteen vaihtamista virheettömään', 'hinnanalennusta', 'kaupan purkamista ja rahojen palauttamista'] },
      { id: 'pvm', label: 'Päivämäärä', type: 'date', def: todayIso },
    ],
    render: v => `${fiDate(v.pvm)}

${b(v.myyja)}

REKLAMAATIO

Ostin teiltä ${fiDate(v.ostopvm)} tuotteen/palvelun: ${b(v.tuote)}${v.hinta ? `, hinta ${v.hinta} euroa` : ''}.${v.tilaus ? ` Tilaus- tai kuittinumero: ${v.tilaus}.` : ''}

Tuotteessa on virhe:
${b(v.virhe)}

Kuluttajansuojalain 5 luvun perusteella vaadin ${b(v.vaatimus)}.

Pyydän vastaustanne 14 päivän kuluessa. Jos asia ei ratkea, voin viedä sen kuluttajaneuvontaan ja kuluttajariitalautakuntaan.

Ystävällisin terveisin

${b(v.nimi)}
${b(v.yhteys)}`,
    faq: [
      ['Kuinka nopeasti reklamaatio pitää tehdä?', 'Kuluttajansuojalain mukaan virheestä on ilmoitettava kohtuullisessa ajassa siitä, kun virhe havaittiin. Ilmoita siis heti, kun huomaat vian.'],
      ['Mitä jos myyjä ei vastaa?', 'Voit pyytää apua maksuttomasta kuluttajaneuvonnasta ja viedä asian kuluttajariitalautakuntaan.'],
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { DOCS, fiDate, tenantEndDate, todayIso };
