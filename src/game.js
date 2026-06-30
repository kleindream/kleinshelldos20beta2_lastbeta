(function () {
  var terminal = document.getElementById('terminal');
  var form = document.getElementById('commandForm');
  var input = document.getElementById('commandInput');
  var promptEl = document.getElementById('prompt');
  var clock = document.getElementById('clock');

  var path = 'C:\\KLEIN';
  var history = [];
  var historyIndex = 0;
  var theme = 'green';

  var state = {
    booted: false,
    currentMission: 1,
    score: 0,
    unlocked: { archives: false, modem: false, backup: false, lab: false, deep: false, trace: false, vault: false },
    flags: {
      readWelcome: false,
      fixedConfig: false,
      foundPassword: false,
      connectedBbs: false,
      restoredBackup: false,
      ranScan: false,
      readManifest: false,
      compiledDream: false,
      protectedBios: false,
      betaComplete: false,
      readSignal: false,
      defragDone: false,
      readCore: false,
      coreCopied: false,
      verifiedCore: false,
      readUserLog: false,
      dreamKeyConnected: false,
      readEthics: false,
      shieldEnabled: false,
      finalMessageRead: false
    }
  };

  var files = {
    'C:\\KLEIN': {
      dirs: ['SYSTEM', 'DOCS', 'TOOLS'],
      files: {
        'WELCOME.TXT': 'Welcome, technician. This is not only a shell. It is a memory machine.\nYour first task: TYPE WELCOME.TXT and then run MISSION.',
        'README.TXT': 'Klein Shell DOS 2.0 Beta 2 adds 20 playable story missions, new directories, ethical puzzles and a stronger Klein Dream identity.\nType HELP to begin.'
      }
    },
    'C:\\KLEIN\\SYSTEM': {
      dirs: [],
      files: {
        'CONFIG.SYS': 'DEVICE=HIMEM.SYS\nFILES=40\nBUFFERS=20\nSHELL=C:\\KLEIN\\COMMAND.COM /P\nSTATUS=NEEDS_REPAIR',
        'AUTOEXEC.BAT': '@ECHO OFF\nPROMPT $P$G\nPATH=C:\\KLEIN;C:\\KLEIN\\TOOLS'
      }
    },
    'C:\\KLEIN\\DOCS': {
      dirs: [],
      files: {
        'DIARY.LOG': '1998-08-14: The machine remembers more than it should.\n1998-08-15: Password hint: the mascot keeps the old disk safe.\n1998-08-16: If the modem answers, do not panic.',
        'MANIFEST.TXT': 'Klein Dream Labs manifesto:\nTechnology should be useful, honest, light, nostalgic and humane.\nFinal version dedication: encourage scientific studies that improve quality of life for people with mental health conditions.'
      }
    },
    'C:\\KLEIN\\TOOLS': {
      dirs: [],
      files: {
        'SCAN.EXE': 'Tool placeholder. Use RUN SCAN to inspect the shell.',
        'FIXCFG.EXE': 'Tool placeholder. Use RUN FIXCFG to repair CONFIG.SYS.',
        'DREAM.EXE': 'Tool placeholder. Use RUN DREAM after reading the manifesto.',
        'BIOSPROT.EXE': 'Tool placeholder. Use RUN BIOSPROT near the end.',
        'DEFRAG.EXE': 'Tool placeholder. Use RUN DEFRAG after reading the LAB signal.',
        'VERIFY.EXE': 'Tool placeholder. Use RUN VERIFY after restoring CORE.DAT.',
        'SHIELD.EXE': 'Tool placeholder. Use RUN SHIELD after reading ETHICS.TXT.'
      }
    },
    'C:\\ARCHIVES': {
      dirs: [],
      files: {
        'PASSWORD.TXT': 'The old BBS password is: DISKETTE',
        'BETA.LOG': 'Beta branch opened. More missions will arrive before final release.\nOperator note: the final path begins only after the LAB message is read.'
      }
    },
    'C:\\MODEM': {
      dirs: [],
      files: {
        'BBS.TXT': 'KLEIN DREAM BBS ONLINE\nMessage from operator: Restore the backup, run the scan, protect the BIOS.'
      }
    },
    'C:\\BACKUP': {
      dirs: [],
      files: {
        'RESTORE.TXT': 'Backup point found. Use COPY RESTORE.TXT C:\\KLEIN\\DOCS to simulate a restore.'
      }
    },
    'C:\\LAB': {
      dirs: [],
      files: {
        'FINAL.NFO': 'Beta 1 ending file. This build is a promise, not the finish line.\nBeta 2 note: Read SIGNAL.LOG to continue beyond the old ending.',
        'SIGNAL.LOG': 'A weak signal is coming from an offline sector.\nIt says: DEFRAG THE MEMORY, RECOVER THE CORE, VERIFY THE DREAM.'
      }
    },
    'C:\\DEEP': {
      dirs: [],
      files: {
        'CORE.DAT': 'KLEIN DREAM CORE\nStatus: fragmented but alive.\nInstruction: copy this file to C:\\KLEIN\\DOCS before verification.',
        'OLDNOTE.TXT': 'The machine was never created to impress people. It was created to teach them to keep going.'
      }
    },
    'C:\\TRACE': {
      dirs: [],
      files: {
        'USER.LOG': 'TRACE REPORT\nThe user returned after every failure.\nNot because it was easy. Because the work mattered.\nKeyword for the final connection: DREAMKEY'
      }
    },
    'C:\\VAULT': {
      dirs: [],
      files: {
        'ETHICS.TXT': 'Klein Dream Code:\n1. Learn with curiosity.\n2. Use knowledge to protect, never to harm.\n3. Winners do not use drugs. They build their victories with their own mind.\n4. It is not about what you say. It is about what you have done.',
        'CLOSING.NFO': 'MISSION COMPLETE\n\nYou learned commands.\nYou solved problems.\nBut that was never the real objective.\n\nThe real mission was becoming a better person.\n\nThank you for playing.\nKlein Dream'
      }
    }
  };

  var missions = [
    { id: 1, text: 'Read WELCOME.TXT using TYPE.', done: function(){ return state.flags.readWelcome; } },
    { id: 2, text: 'Repair the system configuration using RUN FIXCFG.', done: function(){ return state.flags.fixedConfig; } },
    { id: 3, text: 'Find the password inside the archives.', done: function(){ return state.flags.foundPassword; } },
    { id: 4, text: 'Connect to the BBS using CONNECT DISKETTE.', done: function(){ return state.flags.connectedBbs; } },
    { id: 5, text: 'Restore the backup by copying RESTORE.TXT to DOCS.', done: function(){ return state.flags.restoredBackup; } },
    { id: 6, text: 'Run a system scan using RUN SCAN.', done: function(){ return state.flags.ranScan; } },
    { id: 7, text: 'Read the Klein Dream Labs manifesto.', done: function(){ return state.flags.readManifest; } },
    { id: 8, text: 'Compile the dream prototype using RUN DREAM.', done: function(){ return state.flags.compiledDream; } },
    { id: 9, text: 'Protect the BIOS using RUN BIOSPROT.', done: function(){ return state.flags.protectedBios; } },
    { id: 10, text: 'Enter the LAB and read FINAL.NFO.', done: function(){ return state.flags.betaComplete; } },
    { id: 11, text: 'Read the new LAB signal in SIGNAL.LOG.', done: function(){ return state.flags.readSignal; } },
    { id: 12, text: 'Recover the offline sector using RUN DEFRAG.', done: function(){ return state.flags.defragDone; } },
    { id: 13, text: 'Enter C:\\DEEP and read CORE.DAT.', done: function(){ return state.flags.readCore; } },
    { id: 14, text: 'Copy CORE.DAT from C:\\DEEP to C:\\KLEIN\\DOCS.', done: function(){ return state.flags.coreCopied; } },
    { id: 15, text: 'Verify the restored core using RUN VERIFY.', done: function(){ return state.flags.verifiedCore; } },
    { id: 16, text: 'Enter C:\\TRACE and read USER.LOG.', done: function(){ return state.flags.readUserLog; } },
    { id: 17, text: 'Connect to the final vault using CONNECT DREAMKEY.', done: function(){ return state.flags.dreamKeyConnected; } },
    { id: 18, text: 'Read the Klein Dream ethical code in ETHICS.TXT.', done: function(){ return state.flags.readEthics; } },
    { id: 19, text: 'Enable the final protection layer using RUN SHIELD.', done: function(){ return state.flags.shieldEnabled; } },
    { id: 20, text: 'Read CLOSING.NFO and complete Beta 2.', done: function(){ return state.flags.finalMessageRead; } }
  ];

  function addLine(text, cls) {
    var div = document.createElement('div');
    div.className = 'line' + (cls ? ' ' + cls : '');
    div.textContent = text;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function banner() {
    addLine('KLEIN DREAM TERMINAL');
    addLine('Klein Shell DOS 2.0 - BETA 2');
    addLine('Copyright (c) 2026 Rodrigo Klein Mariano Canto / Klein Dream');
    addLine('MIT License - Educational retro shell game');
    addLine('Type HELP to see commands. Type MISSION to continue.');
    addLine('');
  }

  function currentFS() { return files[path]; }
  function normalizeName(name) { return String(name || '').toUpperCase(); }
  function setPrompt() { promptEl.textContent = path + '>'; }
  function updateClock() { clock.textContent = new Date().toLocaleString(); }
  setInterval(updateClock, 1000); updateClock();

  function missionStatus() {
    while (state.currentMission <= missions.length && missions[state.currentMission - 1].done()) {
      state.currentMission++;
      state.score += 10;
    }
    if (state.currentMission > missions.length) {
      addLine('All Beta 2 missions completed. Score: ' + state.score, 'warn');
      return;
    }
    var m = missions[state.currentMission - 1];
    addLine('Mission ' + m.id + '/' + missions.length + ': ' + m.text, 'warn');
  }

  function listDir(wide) {
    var fs = currentFS();
    addLine(' Directory of ' + path);
    addLine('');
    fs.dirs.forEach(function(d){ addLine('<DIR>          ' + d); });
    Object.keys(fs.files).forEach(function(f){ addLine('        ' + String(fs.files[f].length).padStart(6, ' ') + '  ' + f); });
    if (wide) addLine('\nTip: DIR /W works. TREE shows available branches.');
  }

  function tree() {
    addLine('C:\\');
    addLine('├── KLEIN');
    addLine('│   ├── SYSTEM');
    addLine('│   ├── DOCS');
    addLine('│   └── TOOLS');
    if (state.unlocked.archives) addLine('├── ARCHIVES');
    if (state.unlocked.modem) addLine('├── MODEM');
    if (state.unlocked.backup) addLine('├── BACKUP');
    if (state.unlocked.lab) addLine('├── LAB');
    if (state.unlocked.deep) addLine('├── DEEP');
    if (state.unlocked.trace) addLine('├── TRACE');
    if (state.unlocked.vault) addLine('└── VAULT');
  }


  function isPathUnlocked(next) {
    if (next.indexOf('C:\\ARCHIVES') === 0) return state.unlocked.archives;
    if (next.indexOf('C:\\MODEM') === 0) return state.unlocked.modem;
    if (next.indexOf('C:\\BACKUP') === 0) return state.unlocked.backup;
    if (next.indexOf('C:\\LAB') === 0) return state.unlocked.lab;
    if (next.indexOf('C:\\DEEP') === 0) return state.unlocked.deep;
    if (next.indexOf('C:\\TRACE') === 0) return state.unlocked.trace;
    if (next.indexOf('C:\\VAULT') === 0) return state.unlocked.vault;
    return true;
  }

  function changeDir(target) {
    target = normalizeName(target);
    if (!target || target === '.') return;
    if (target === '..') {
      if (path !== 'C:\\KLEIN') {
        var parts = path.split('\\'); parts.pop(); path = parts.join('\\') || 'C:\\KLEIN';
      }
      setPrompt(); return;
    }
    var next = target.indexOf('C:\\') === 0 ? target : path + '\\' + target;
    if (files[next] && isPathUnlocked(next)) { path = next; setPrompt(); }
    else if (files[next] && !isPathUnlocked(next)) addLine('Access denied. Complete the required mission first.', 'danger');
    else addLine('Invalid directory: ' + target, 'danger');
  }

  function typeFile(name) {
    name = normalizeName(name);
    var fs = currentFS();
    if (!fs.files[name]) { addLine('File not found: ' + name, 'danger'); return; }
    addLine(fs.files[name]);
    if (name === 'WELCOME.TXT') state.flags.readWelcome = true;
    if (path === 'C:\\ARCHIVES' && name === 'PASSWORD.TXT') state.flags.foundPassword = true;
    if (path === 'C:\\KLEIN\\DOCS' && name === 'MANIFEST.TXT') state.flags.readManifest = true;
    if (path === 'C:\\LAB' && name === 'FINAL.NFO') state.flags.betaComplete = true;
    if (path === 'C:\\LAB' && name === 'SIGNAL.LOG') state.flags.readSignal = true;
    if (path === 'C:\\DEEP' && name === 'CORE.DAT') state.flags.readCore = true;
    if (path === 'C:\\TRACE' && name === 'USER.LOG') state.flags.readUserLog = true;
    if (path === 'C:\\VAULT' && name === 'ETHICS.TXT') state.flags.readEthics = true;
    if (path === 'C:\\VAULT' && name === 'CLOSING.NFO') state.flags.finalMessageRead = true;
  }

  function runTool(name) {
    name = normalizeName(name).replace('.EXE','');
    if (name === 'FIXCFG') {
      state.flags.fixedConfig = true; state.unlocked.archives = true; files['C:\\KLEIN\\SYSTEM'].files['CONFIG.SYS'] = files['C:\\KLEIN\\SYSTEM'].files['CONFIG.SYS'].replace('NEEDS_REPAIR','OK');
      addLine('CONFIG.SYS repaired. Hidden directory unlocked: C:\\ARCHIVES', 'warn');
    } else if (name === 'SCAN') {
      state.flags.ranScan = true; state.unlocked.lab = true; addLine('Scan complete. No virus found. LAB directory unlocked.', 'warn');
    } else if (name === 'DREAM') {
      if (!state.flags.readManifest) { addLine('DREAM requires MANIFEST.TXT to be read first.', 'danger'); return; }
      state.flags.compiledDream = true; addLine('Dream prototype compiled. Nostalgia engine stable.', 'warn');
    } else if (name === 'BIOSPROT') {
      state.flags.protectedBios = true; addLine('BIOS protection simulated. Unauthorized boot changes blocked.', 'warn');
    } else if (name === 'DEFRAG') {
      if (!state.flags.readSignal) { addLine('DEFRAG requires SIGNAL.LOG to be read first.', 'danger'); return; }
      state.flags.defragDone = true; state.unlocked.deep = true; addLine('Offline sector recovered. Hidden directory unlocked: C:\\DEEP', 'warn');
    } else if (name === 'VERIFY') {
      if (!state.flags.coreCopied) { addLine('VERIFY requires CORE.DAT restored to C:\\KLEIN\\DOCS first.', 'danger'); return; }
      state.flags.verifiedCore = true; state.unlocked.trace = true; addLine('Core verified. Trace directory unlocked: C:\\TRACE', 'warn');
    } else if (name === 'SHIELD') {
      if (!state.flags.readEthics) { addLine('SHIELD requires ETHICS.TXT to be read first.', 'danger'); return; }
      state.flags.shieldEnabled = true; addLine('Final shield enabled. Knowledge protected by ethics.', 'warn');
    } else {
      addLine('Bad command or file name: RUN ' + name, 'danger');
    }
  }

  function copyFile(src, dest) {
    src = normalizeName(src); dest = normalizeName(dest);
    var fs = currentFS();
    if (!fs.files[src]) { addLine('Source file not found.', 'danger'); return; }
    var targetDir = dest.indexOf('C:\\') === 0 ? dest : path;
    if (targetDir.indexOf('\\') > -1 && !files[targetDir]) {
      var parts = targetDir.split('\\'); parts.pop(); targetDir = parts.join('\\');
    }
    if (!files[targetDir]) { addLine('Target path not found.', 'danger'); return; }
    files[targetDir].files[src] = fs.files[src];
    addLine('1 file(s) copied.');
    if (path === 'C:\\BACKUP' && src === 'RESTORE.TXT' && targetDir === 'C:\\KLEIN\\DOCS') state.flags.restoredBackup = true;
    if (path === 'C:\\DEEP' && src === 'CORE.DAT' && targetDir === 'C:\\KLEIN\\DOCS') state.flags.coreCopied = true;
  }

  function help() {
    addLine('Available commands:');
    addLine('HELP, DIR, DIR /W, TREE, CD, TYPE, RUN, COPY, CLS, VER, MEM, DATE, TIME');
    addLine('MISSION, SCORE, THEME GREEN/AMBER/BLUE, CONNECT <PASSWORD>, ABOUT, EXIT');
  }

  function about() {
    addLine('Klein Shell DOS 2.0 Beta 2 is a retro educational command-line game by Klein Dream.');
    addLine('Created by Rodrigo Klein Mariano Canto with assistance from Lolita/ChatGPT.');
    addLine('Goal: teach logic, DOS-like commands and troubleshooting through story missions.');
  }

  function setTheme(t) {
    t = normalizeName(t);
    var root = document.documentElement;
    if (t === 'AMBER') { root.style.setProperty('--fg','#FFD479'); root.style.setProperty('--dim','#B8862C'); theme='amber'; }
    else if (t === 'BLUE') { root.style.setProperty('--fg','#8CCBFF'); root.style.setProperty('--dim','#3A83B8'); theme='blue'; }
    else { root.style.setProperty('--fg','#7CFF7C'); root.style.setProperty('--dim','#3BBF3B'); theme='green'; }
    addLine('Theme set to ' + theme + '.');
  }

  function processCommand(raw) {
    var line = raw.trim();
    if (!line) return;
    addLine(path + '>' + line, 'dim');
    var parts = line.split(/\s+/);
    var cmd = normalizeName(parts[0]);
    var arg = parts.slice(1).join(' ');

    if (cmd === 'HELP') help();
    else if (cmd === 'DIR') listDir(arg.toUpperCase() === '/W');
    else if (cmd === 'TREE') tree();
    else if (cmd === 'CD') changeDir(arg);
    else if (cmd === 'TYPE') typeFile(arg);
    else if (cmd === 'RUN') runTool(arg);
    else if (cmd === 'COPY') { var c = arg.split(/\s+/); copyFile(c[0], c.slice(1).join(' ')); }
    else if (cmd === 'CLS') terminal.innerHTML = '';
    else if (cmd === 'VER') addLine('Klein Shell DOS version 2.0 Beta 2');
    else if (cmd === 'MEM') addLine('655360 bytes conventional memory\n524288 bytes free\nNostalgia memory: unlimited');
    else if (cmd === 'DATE') addLine(new Date().toLocaleDateString());
    else if (cmd === 'TIME') addLine(new Date().toLocaleTimeString());
    else if (cmd === 'MISSION' || cmd === 'MISSIONS') missionStatus();
    else if (cmd === 'SCORE') addLine('Score: ' + state.score); 
    else if (cmd === 'THEME') setTheme(arg);
    else if (cmd === 'ABOUT') about();
    else if (cmd === 'CONNECT') {
      if (normalizeName(arg) === 'DISKETTE') { state.flags.connectedBbs = true; state.unlocked.modem = true; state.unlocked.backup = true; addLine('CONNECT 56K... OK. MODEM and BACKUP unlocked.', 'warn'); }
      else if (normalizeName(arg) === 'DREAMKEY') {
        if (!state.flags.readUserLog) { addLine('Connection refused. USER.LOG must be read first.', 'danger'); return; }
        state.flags.dreamKeyConnected = true; state.unlocked.vault = true; addLine('CONNECT DREAMKEY... OK. VAULT unlocked.', 'warn');
      }
      else addLine('Connection refused. Password required.', 'danger');
    }
    else if (cmd === 'EXIT') addLine('Close the window to exit Beta 2.');
    else addLine('Bad command or file name: ' + cmd, 'danger');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = input.value;
    history.push(value); historyIndex = history.length;
    input.value = '';
    processCommand(value);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') { historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ''; setTimeout(function(){ input.selectionStart = input.selectionEnd = input.value.length; }, 0); }
    if (e.key === 'ArrowDown') { historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] || ''; }
  });

  banner(); setPrompt(); input.focus();
})();
