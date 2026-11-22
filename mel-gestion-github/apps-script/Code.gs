/**
 * Mel Pâtisserie & Snacks — liaison entre l'application et Google Sheets.
 *
 * 1. Remplace le code secret ci-dessous par un mot de passe à toi
 *    (garde-le : tu le taperas une fois dans l'application).
 * 2. Déployer > Nouveau déploiement > Application Web
 *    Exécuter en tant que : Moi    Accès : Tout le monde
 * 3. Copie l'URL qui finit par /exec et colle-la dans les réglages de l'application.
 */
const CODE_SECRET = 'CHANGE-MOI';

const COLONNES = {
  commandes: ['id', 'client', 'tel', 'produit', 'details', 'date', 'heure', 'lieu', 'total', 'acompte', 'paiement', 'rappel', 'statut', 'maj'],
  achats: ['id', 'date', 'cat', 'article', 'qte', 'unite', 'montant', 'fournisseur', 'maj'],
  ventes: ['id', 'date', 'paiement', 'produit', 'qte', 'montant', 'client', 'cmd', 'maj']
};

function feuille_(nom) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(nom);
  if (!sh) {
    sh = ss.insertSheet(nom);
    sh.getRange('A:Z').setNumberFormat('@');
    sh.getRange(1, 1, 1, COLONNES[nom].length).setValues([COLONNES[nom]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function lire_(nom) {
  const sh = feuille_(nom);
  const valeurs = sh.getDataRange().getDisplayValues();
  const entetes = valeurs.shift() || [];
  return valeurs.filter(r => r[0]).map(r => {
    const o = {};
    entetes.forEach((k, i) => { if (k) o[k] = r[i]; });
    return o;
  });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (String(e.parameter.cle || '') !== CODE_SECRET) return json_({ ok: false, err: 'cle' });
  const out = { ok: true };
  Object.keys(COLONNES).forEach(n => { out[n] = lire_(n); });
  return json_(out);
}

function doPost(e) {
  const verrou = LockService.getScriptLock();
  verrou.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (String(b.cle || '') !== CODE_SECRET) return json_({ ok: false, err: 'cle' });
    (b.ops || []).forEach(op => {
      const h = COLONNES[op.col];
      if (!h || !op.id) return;
      const sh = feuille_(op.col);
      const ids = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getDisplayValues().map(r => r[0]);
      const i = ids.indexOf(String(op.id));
      if (op.op === 'del') {
        if (i > 0) sh.deleteRow(i + 1);
      } else {
        const ligne = h.map(k => (op.obj && op.obj[k] != null) ? String(op.obj[k]) : '');
        ligne[0] = String(op.id);
        const n = i > 0 ? i + 1 : sh.getLastRow() + 1;
        sh.getRange(n, 1, 1, h.length).setNumberFormat('@').setValues([ligne]);
      }
    });
    return json_({ ok: true });
  } finally {
    verrou.releaseLock();
  }
}
