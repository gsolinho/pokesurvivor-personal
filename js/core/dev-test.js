/* Perfil temporal de pruebas. Sólo se carga desde dev.html en la copia local. */
G.DevTest = (() => {
  function activate() {
    const params = new URLSearchParams(location.search);
    if (!params.has('test') ||
        !location.pathname.endsWith('/dev.html') ||
        G.DB.mode !== 'local' || G.FIREBASE_CONFIG !== null) return false;

    // La cuenta local anterior sigue guardada; esta partida vive sólo en memoria.
    G.DB.playAsGuest({ preserveSession: true, name: 'Pruebas' });
    const save = G.DB.save;
    const now = Date.now();
    const maxUpgrades = Object.fromEntries(G.Upgrades.LIST.map(u => [u.id, u.max]));

    save.coins = 1000000;
    save.tickets = { t1: 999, t10: 999 };
    for (const mon of G.DEX) {
      save.owned[mon.dex] = { at: now, from: 'test' };
      save.shiny[mon.dex] = { at: now, from: 'test' };
      save.pupg[mon.dex] = { ...maxUpgrades };
    }
    save.partner = G.DEX_BY[152] ? 152 : G.DEX[0].dex;
    save.starter = save.partner;
    if (params.get('move') === 'electro-ball' && G.DEX_BY[25]) {
      save.partner = 25;                      // Pikachu: tipo Eléctrico
      save.starter = 25;
      save.pstart[25] = 'electro-ball';      // Movimiento inicial ya desbloqueado
    } else if (params.get('move') === 'karate-chop' && G.DEX_BY[68]) {
      save.partner = 68;                      // Machamp: luchador físico para probar melee
      save.starter = 68;
      save.pstart[68] = 'karate-chop';
    } else if (params.get('move') === 'thunder-punch' && G.DEX_BY[466]) {
      save.partner = 466;                     // Electivire: Eléctrico físico
      save.starter = 466;
      save.pstart[466] = 'thunder-punch';
    }
    return true;
  }

  return { activate };
})();
