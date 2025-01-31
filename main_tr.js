/*
████████████████████████████████████████████████████████████████████████
                𝗛𝗔𝗫𝗕𝗔𝗟𝗟 𝗗𝗜𝗦𝗖𝗢𝗥𝗗 𝗘𝗡𝗧𝗘𝗚𝗥𝗘𝗟𝗜 𝗚𝗘𝗟𝗜𝗦𝗠𝗜𝗦 𝗕𝗢𝗧
████████████████████████████████████████████████████████████████████████

🎉 𝗚𝗲𝗹𝗶𝘀𝘁𝗶𝗿𝗶𝗰𝗶 
 - Discord: kgn.official
 - Version: 1.17

🎉 Bu proje, kodlama bilgisi olmayan ancak birçok farklı seçenekle HaxBall odası oluşturmak ve yönetmek isteyen kişilere yardımcı olmak amacıyla hazırlanmıştır. 
Ayrıca, Discord entegrasyonu sayesinde kullanıcılar, oda yönetimine Discord üzerinden müdahale edebilir, çeşitli komutlarla odayı kontrol edebilir. 

🚀 𝗢𝗡𝗘 𝗖𝗜𝗞𝗔𝗡 𝗢𝗭𝗘𝗟𝗟𝗜𝗞𝗟𝗘𝗥

 -  Gelişmiş İstatistik Sistemi
 -  Discord Entegrasyonu (Discord üzerinden oda yönetimi)
 -  Takım İçi ve Oyuncu İçi Sohbet
 -  Şut Hızı ile Beraber Gol Bildirimi
 -  Otomatik Oyun Kaydı
 -  Admin ve Ban Sistemi
 -  Discord Üzerinden Admin Çağrı Sistemi
 -  Rank Sistemi
  - Ve daha fazlası!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📜 𝗦𝗢𝗥𝗨𝗠𝗟𝗨𝗟𝗨𝗞 𝗥𝗘𝗗𝗗𝗜 (𝗗𝗜𝗦𝗖𝗟𝗔𝗜𝗠𝗘𝗥)

---

TURKİSH

Bu yazılım, "olduğu gibi" sunulmaktadır ve herhangi bir garanti içermez. 
Geliştiriciler, bu yazılımın kullanımından doğabilecek doğrudan veya dolaylı 
zararlardan, veri kaybından, hizmet kesintilerinden veya üçüncü tarafların 
eylemlerinden hiçbir şekilde sorumlu tutulamaz. 

Kullanıcı, bu yazılımı kullanarak tüm sorumluluğu kabul eder ve geliştiricileri 
her türlü yasal ve mali yükümlülükten muaf tutar.

Bu proje açık kaynaklı olup, kullanımı tamamen bireysel sorumluluk altındadır. 
Hukuki veya etik sorunlar ile ilgili tüm sorumluluk kullanıcıya aittir.

---

ENGLİSH

This software is provided "as is" and does not come with any warranty.
The developers cannot be held responsible for any direct or indirect damages, data loss, service interruptions, or third-party actions resulting from the use of this software.

By using this software, the user accepts all responsibility and releases the developers from any legal or financial liabilities.

This project is open-source, and its use is completely at the user's own risk.
All legal or ethical issues are the responsibility of the user.


████████████████████████████████████████████████████████████████████████
*/



const DİSCORD_BOT_TOKEN = "" /* Discord bot tokeni oluşturun 
UYARI:
- Botunuza Discordda verdiğiniz rol, rol listesinde en yukarda olmalıdır. Tüm yetkiler verilmelidir.
- Privileged Gateway Intents ayarlarının hepsi açılmalıdır.
- Bot davet edilirken - OAuth2 kullanarak - scopes ayarlarından application.commands ve bot seçilmelidir ve Admin yetkisi verilmelidir.

*/

/*  NOT: öncelikle genel oda ayarlarını kendinize göre ayarlayın boş bırakmamanız tavsiye edilir.
    Kodunuzun adını main.js olarak adlandırın ve aynı yere bir maps klasörü oluşturun
    Bu klasöre;
    training.hbs => antrenman mapi
    classic.hbs => 1v1 ve 2v2 mapi ORTAKTIR!
    big.hbs => 3v3 mapi 
    ekleyin.

*/
/*████████████████████████ GENEL AYARLAR ████████████████████████*/
/* Bu kısımda kullanacağım kütüphaneler yer alıyor.
 - haxball.js => node.js üzerinden oda başlatmamıza imkan tanıyan npm modülü
 - node-localstorage => Tarayıcıdaki localStorage i daha gelişmiş olarak yerel bir depolama alanı olarak kullanmamızı sağlıyor.
 - fs ve path maps klasöründen mapleri çekerken kullandım sadece çok önemli değil kodun temiz kalması için ekledim
*/
const HaxballJS = require('haxball.js');
const { LocalStorage } = require('node-localstorage');
const { Client, GatewayIntentBits, SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const LocalStatsStorage = new LocalStorage('./Stats'); // Oyuncu İstatistikleri oyuncu adı anahtar olarak kullanarak depolanıyor.
const LocalProfilesStorage = new LocalStorage('./Profiles'); // Haxball hesaplarının şifreleri, authlar, connlar... depolanıyor
const LocalListsStorage = new LocalStorage('./Lists'); // admin listesi, ban listesi ... depolanıyor
const LocalDiscordProfilesStorage = new LocalStorage('./DiscordProfiles'); // discord haxball hesap eşleştirmeleri depolanıyor

/*████████████████████████ GENEL ODA AYARLARI ████████████████████████*/
console.clear()
var callWebhook = ''; // Admin çağrılarının gideceği webhook, özel bir kanal yapmalısınız.
const roleMentions = "<@&1029434387794774485> <@&1029443499776012457>"; // Buraya çağrı sırasında etiketlenecek admin rollerinin ID lerini ekleyin
// Verilen rol ID leri örnektir eğer o kanala erişimi olan herkesin görmesini istiyorsanız @everyone da ekleyebilirsiniz.
var gameWebhook = '';  // Maç kayıtlarının gideceği webhook, herkese açık bir kanal olmalı
var banWebhook = ''; // Ban işlemlerinin gideceği webhook.

// PEKİ WEBHOOK NASIL OLUŞTURURUM? => https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

const ADMIN_ROLE_ID = '1329444499726012457';  // Discord admin komutlarına erişimi olan rolün ID si

// Odanın Konum Bilgileri
// Tüm odaların konumunu görebileceğiniz API => https://api.sefinek.net/api/v2/haxball/room-list
const LAT = 40.200005
const LON = 29

var drawTimeLimit = 10; // 10 dakika sonunda eğer skorlar eşitse beraberlik ilan edilir.
var defaultSlowMode = 3; // yavaş mod herkes için geçerli

var minAFKDuration = 0; // min afk kalma süresi
var maxAFKDuration = 10; // max afk kalma süresi sonra kick
var AFKCooldown = 0; // afk komutu kaç saniyede bir kullanılabilir

const maxPlayers = 10; // Max oyuncu sayısı
var discordLink = "" // Discord linkiniz
const roomName = ''; // Oda adı
var roomWebhook = ''; // Oda kayıtlarının (odaya katılma ayrılma chat...) iletildiği log webhooku, özel kanal olmalı
var roomLink = null
const token = "" // => https://www.haxball.com/headlesstoken 

var masterPassword = 17845 // Yönetici kodudur. Odaya girince !yöneticikodum kod yazarak kalıcı yetki alırsınız. Sınırsız yekti!

var debugMode = false; // Odadanız test modundaysa true yapın bu AFK kick vb. şeyleri kapatacaktır. Ayrıca public: false olarak ayarlayacaktır.

var teamSize = 3 // Maksimum takım kapasitesi (Önerim 3 olarak kalmasıdır fakat isterseniz 4 yapabilirsiniz)
// Burada unutmamanız gereken şey antrenmanda training map 1v1 ve 2v2 de classic 3v3 de ise big map açılır eğer teamsize ı 
// 3 den büyük yaparsanız yine de bigmap olarak kalacaktır yani 3 kişilik map ile 4 kişilik map aynı map olacaktır.

const PROXY = null  // Proxy kullanarak birden fazla oda açabilirsiniz.

/* Proxy aşağıdaki formatta olmalıdır.

"http://IP:PORT"
                    Örnek: "http://1.1.1.1:80"

*/


// YAPILACAK DUYURULARIN LİSTESİ SIRASIYLA YAPILIR HER ODA AÇILDIĞINDA

const announcementList = [
    `Admin başvuruları açılmıştır.Discord adresimizden başvurabilirsiniz. 
${discordLink}`,
    `Turnuvalar, çekilişler ve daha fazlası için Discord sunucumuza katılın! 
${discordLink}`,

];




var passwordLengths = { min: 4, max: 8 }; // Şifre için min max uzunluk
var loginTimeout = 20; // Kaç saniye içerisinde giriş yapılmazsa atılsın ? -- kayıtsızlar atılmaz sadece stat kaydedilmez

/*████████████████████████ DİSCORD BOTU ████████████████████████*/
const client = new Client({ 	
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
], });


/*████████████████████████ HAXBALL BOTU ████████████████████████*/

var password = null

HaxballJS.then((HBInit) => {


var fetchRecordingVariable = true;
var timeLimit = 3;
var scoreLimit = 3;

var gameConfig = {
    roomName: roomName,
    maxPlayers: maxPlayers,
    public: !debugMode,
    noPlayer: true,
    password: password,
    geo: {"code": "tr", "lat": LAT, "lon": LON},
    proxy: PROXY,
    token: token
}
const room = HBInit(gameConfig);
client.room = room // discord ile etkileşime geçmek için kullanılacak nesne

const mapsDir = path.join(__dirname, 'maps');
const trainingMap = fs.readFileSync(path.join(mapsDir, 'training.hbs'), 'utf8');
const classicMap = fs.readFileSync(path.join(mapsDir, 'classic.hbs'), 'utf8');
const bigMap = fs.readFileSync(path.join(mapsDir, 'big.hbs'), 'utf8');
var currentStadium = 'antrenmanmap';

room.setScoreLimit(scoreLimit);
room.setTimeLimit(timeLimit);
room.setTeamsLock(true);
room.setKickRateLimit(6, 0, 0);

var roomPassword = '';

/* OPTIONS */

var maxAdmins = 0;
var disableBans = false;
var afkLimit = debugMode ? Infinity : 15

var chooseModeSlowMode = 0;
var slowMode = defaultSlowMode;
var SMSet = new Set();

var mentionPlayersUnpause = true;

var darkBlue = 0x037ff6
var lightBlue = 0x01d6f9

/* ADMİN CALL */

var lastCall = null; // Son çağrılma zamanı

function callAdminCommand(player, message) {
    const now = Date.now();   
    
    // Eğer son komut çağrılma zamanı 3 dakikadan kısa ise
    if (lastCall && now - lastCall < 3 * 60 * 1000) {
        // Kalan süreyi hesapla
        const remainingTime = 3 * 60 * 1000 - (now - lastCall);
        const remainingMinutes = Math.floor(remainingTime / (60 * 1000)); // Dakika
        const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000); // Saniye
        
        // Kalan süreyi oyuncuya bildir
        room.sendAnnouncement(
            `${player.name}, bu komutu tekrar kullanabilmek için ${remainingMinutes} dakika ${remainingSeconds} saniye beklemeniz gerekiyor!`,
            player.id,
            errorColor,
            "bold",
            2
        );
        return false // Komut devam etmesin, kalan süreyi gösterdik
    }

    // Son kullanım zamanını güncelle
    lastCall = now;

    
    room.sendAnnouncement(`Admin çağrıldı`, null, 0x1b02a3, "bold", 2);

    const reason = message.split(' ').slice(1).join(' ').trim();
    const finalReason = reason.length > 0 ? reason : "Sebep belirtilmedi.";    
    // Webhook ile çağrı yapma (isteğe bağlı)
    let form = new FormData();
    form.append("payload_json", JSON.stringify({
        content: roleMentions, // Admin rol etiketleme
        username: "Admin Çağrı Sistemi",
        embeds: [{
            title: "ADMIN ÇAĞRISI",
            description: `\`[ ${roomName} ]\` odasında admine ihtiyaç var.`,
            color: 3447003, // Embed rengi (hexa kodu)
            fields: [
                {
                    name: "**Çağıran Oyuncu**",
                    value: `#${player.id} ${player.name}`,
                    inline: true
                },
                {
                    name: "**Sebep**",
                    value: finalReason,
                    inline: true
                },
                {
                    name: "**Oda Linki**",
                    value: `[Odaya Bağlanmak İçin Tıkla](${roomLink})`,
                    inline: false
                }
            ],
            timestamp: new Date(),
        }],
        
    }));

    fetch(callWebhook, {
        method: 'POST',
        body: form,
    })
    .then((res) => {
        if (res.ok) {
        } else {
        }
    })
    .catch((err) => {
    });
}

/* LİSTE KONTROLÜ */

// LS ile listeleri sync eden fonksiyonlar bulunur

function listeleriYükle() {
    const loadedBanList = LocalListsStorage.getItem('banList');
    const loadedMasterList = LocalListsStorage.getItem('masterList');
    const loadedAdminList = LocalListsStorage.getItem('adminList');

    banList = loadedBanList ? JSON.parse(loadedBanList) : [];
    masterList = loadedMasterList ? JSON.parse(loadedMasterList) : [];
    adminList = loadedAdminList ? JSON.parse(loadedAdminList) : [];
}

function listeleriGüncelle() {
    LocalListsStorage.setItem('banList', JSON.stringify(banList));
    LocalListsStorage.setItem('masterList', JSON.stringify(masterList));
    LocalListsStorage.setItem('adminList', JSON.stringify(adminList));
}

function listeleriYükleYadaOluştur() {
    // Ban listesi kontrol ve yükleme/oluşturma
    if (LocalListsStorage.getItem('banList')) {
        banList = JSON.parse(LocalListsStorage.getItem('banList'));
    } else {
        LocalListsStorage.setItem('banList', JSON.stringify(banList));
    }

    // Master listesi kontrol ve yükleme/oluşturma
    if (LocalListsStorage.getItem('masterList')) {
        masterList = JSON.parse(LocalListsStorage.getItem('masterList'));
    } else {
        LocalListsStorage.setItem('masterList', JSON.stringify(masterList));
    }

    // Admin listesi kontrol ve yükleme/oluşturma
    if (LocalListsStorage.getItem('adminList')) {
        adminList = JSON.parse(LocalListsStorage.getItem('adminList'));
    } else {
        LocalListsStorage.setItem('adminList', JSON.stringify(adminList));
    }
}

/* OBJECTS */

class Goal {
    constructor(time, team, striker, assist) {
        this.time = time;
        this.team = team;
        this.striker = striker;
        this.assist = assist;
    }
}

class Game {
    constructor() {
        this.date = Date.now();
        this.scores = room.getScores();
        this.playerComp = getStartingLineups();
        this.goals = [];
        this.rec = room.startRecording();
        this.touchArray = [];
    }
}

class PlayerComposition {
    constructor(player, auth, timeEntry, timeExit) {
        this.player = player;
        this.auth = auth;
        this.timeEntry = timeEntry;
        this.timeExit = timeExit;
        this.inactivityTicks = 0;
        this.GKTicks = 0;
    }
}

class MutePlayer {
    constructor(name, id, auth) {
        this.id = MutePlayer.incrementId();
        this.name = name;
        this.playerId = id;
        this.auth = auth;
        this.unmuteTimeout = null;
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }

    setDuration(minutes) {
        this.unmuteTimeout = setTimeout(() => {
            room.sendAnnouncement(
                `📢 Susturulma cezan bitti.`,
                this.playerId,
                announcementColor,
                "bold",
                HaxNotification.CHAT
            );
            this.remove();
        }, minutes * 60 * 1000);
        muteArray.add(this);
    }

    remove() {
        this.unmuteTimeout = null;
        muteArray.removeById(this.id);
    }
}

class MuteList {
    constructor() {
        this.list = [];
    }

    add(mutePlayer) {
        this.list.push(mutePlayer);
        return mutePlayer;
    }

    getById(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    getByPlayerId(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.playerId === id);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    getByAuth(auth) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    removeById(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }

    removeByAuth(auth) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }
}

class BallTouch {
    constructor(player, time, goal, position) {
        this.player = player;
        this.time = time;
        this.goal = goal;
        this.position = position;
    }
}

class HaxStatistics {
    constructor(playerName = '') {
        this.playerName = playerName;
        this.games = 0;
        this.wins = 0;
        this.winrate = '0.00%';
        this.playtime = 0;
        this.goals = 0;
        this.assists = 0;
        this.CS = 0;
        this.ownGoals = 0;
    }
}

/* PLAYERS */

const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
const State = { PLAY: 0, PAUSE: 1, STOP: 2 };
const Role = { PLAYER: 0, ADMIN_TEMP: 1, ADMIN_PERM: 2, MASTER: 3 };
const HaxNotification = { NONE: 0, CHAT: 1, MENTION: 2 };
const Situation = { STOP: 0, KICKOFF: 1, PLAY: 2, GOAL: 3 };

var gameState = State.STOP;
var playSituation = Situation.STOP;
var goldenGoal = false;

var playersAll = [];
var players = [];
var teamRed = [];
var teamBlue = [];
var teamSpec = [];

var teamRedStats = [];
var teamBlueStats = [];

var banList = [];

/* STATS */

var possession = [0, 0];
var actionZoneHalf = [0, 0];
var lastWinner = Team.SPECTATORS;
var streak = 0;

/* AUTH */

var authArray = [];
var adminList = [
    ['cDz3jGFWtU8OvYpHt34GS-bbVhAVq1Hfajk8jHqxfm8', 'dc: kgn.official'],
    // ['INSERT_AUTH_HERE', 'NICK_OF_ADMIN'],
    // ['INSERT_AUTH_HERE', 'NICK_OF_ADMIN'],
];
var masterList = [
    'cDz3jGFWtU8OvYpHt34GS-bbVhAVq1Hfajk8jHqxfm8', // örnek auth verilmiştir.
    // 'INSERT_MASTER_AUTH_HERE'
    // 'INSERT_MASTER_AUTH_HERE'
    // 'INSERT_MASTER_AUTH_HERE'
];

/* İSXXX FUNC */ 
function isMaster(player) {
    if (masterList.findIndex((auth) => auth == authArray[player.name][0]) != -1) {
        return true
    } else {
        return false
    }    
    
}
function isAdmin(player) {
    if (adminList.map((a) => a[0]).findIndex((auth) => auth == authArray[player.name][0]) != -1) {
        return true
    } else {
        return false
    }
}
function isSpecial (player) {
    if (isAdmin(player) || isMaster(player)) {
        return true
    } else {
        return false
    }
}
/* COMMANDS */



var commands = {
    komutlar: {
        aliases: ['cmds'],
        roles: Role.PLAYER,
        desc: true,
        function: helpCommand,
    },
    adminçağır: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: callAdminCommand,
    },
    discord: {
        aliases: ['dc'],
        roles: Role.PLAYER,
        desc: true,
        function: dcLinkGönder,
    },
    moderatorkomutları: {
        aliases: [],
        roles: Role.ADMIN_PERM,
        desc: true,
        function: modCommands,
    },
    yöneticikomutları: {
        aliases: [],
        roles: Role.MASTER,
        desc: true,
        function: yöneticiCommands,
    },
    kayıt: {
        aliases: ['register'],
        roles: Role.PLAYER,
        desc: true,
        function: registerCommand,
    },
    giriş: {
        aliases: ['login'],
        roles: Role.PLAYER,
        desc: true,
        function: loginCommand,
    },
    yöneticikodum: {
        aliases: [],
        roles: Role.PLAYER,
        desc: false,
        function: masterCommand,
    },
    afk: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: afkCommand,
    },
    afklar: {
        aliases: ['afklistesi'],
        roles: Role.PLAYER,
        desc: true,
        function: afkListCommand,
    },
    bb: {
        aliases: ['bye'],
        roles: Role.PLAYER,
        desc: true,
        function: leaveCommand,
    },
    rank: {
        aliases: ['stat', 'stats'],
        roles: Role.PLAYER,
        desc: true,
        function: globalStatsCommand,
    },
    ençokoynayanlar: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: statsLeaderboardCommand,
    },
    ençokkazananlar: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: statsLeaderboardCommand,
    },
    golkrallığı: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: statsLeaderboardCommand,
    },
    asistkrallığı: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: statsLeaderboardCommand,
    },
    eniyikaleciler: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: statsLeaderboardCommand,
    },
    enaktifler: {
        aliases: [],
        roles: Role.PLAYER,
        desc: true,
        function: statsLeaderboardCommand,
    },
    antrenmanmap: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: stadiumCommand,
    },
    küçükmap: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: stadiumCommand,
    },
    büyükmap: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: stadiumCommand,
    },
    rr: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: restartCommand,
    },
    rrs: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: restartSwapCommand,
    },
    s: {
        aliases: ['s'],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: swapCommand,
    },
    kırmızıtakımıat: {
        aliases: ['kickr'],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: kickTeamCommand,
    },
    mavitakımıat: {
        aliases: ['kickb'],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: kickTeamCommand,
    },
    izleyicileriat: {
        aliases: ['kicks'],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: kickTeamCommand,
    },
    mute: {
        aliases: ['m'],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: muteCommand,
    },
    mutekaldır: {
        aliases: ['unmute'],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: unmuteCommand,
    },
    muteliler: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: true,
        function: muteListCommand,
    },
    banlarıtemizle: {
        aliases: [],
        roles: Role.MASTER,
        desc: true,
        function: clearbansCommand,
    },
    banlılar: {
        aliases: ['banlistesi'],
        roles: Role.MASTER,
        desc: true,
        function: banListCommand,
    },
    moderatorler: {
        aliases: ['moderatorlistesi','modlar'],
        roles: Role.MASTER,
        desc: true,
        function: adminListCommand,
    },
    modver: {
        aliases: ['moderatorekle'],
        roles: Role.MASTER,
        desc: true,
        function: setAdminCommand,
    },
    modsil: {
        aliases: ['moderatorsil'],
        roles: Role.MASTER,
        desc: true,
        function: removeAdminCommand,
    },
    şifre: {
        aliases: ['password'],
        roles: Role.MASTER,
        desc: true,
        function: passwordCommand,
    },
};


/* GAME */

var lastTouches = Array(2).fill(null);
var lastTeamTouched;

var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
var ballSpeed = 0;
var playerRadius = 15;
var ballRadius = 5.8;
var triggerDistance = playerRadius + ballRadius + 0.01;

/* RENKLER */

var yöneticiColor = 0x5d918c
var moderatorColor = 0x5c8759
var welcomeColor = 0x03fe69
var announcementColor = 0xffefd6;
var infoColor = 0xffffff
var redColor = 0x9c2f2f;
var blueColor = 0x344185
var warningColor = 0xffa135;
var errorColor = 0xb50000;
var successColor = 0x2bd92b;
var defaultColor = null;

/* AUXILIARY */

var checkTimeVariable = false;
var checkStadiumVariable = true;
var endGameVariable = false;
var cancelGameVariable = false;
var kickFetchVariable = false;

var chooseMode = false;
var timeOutCap;
var capLeft = false;
var redCaptainChoice = '';
var blueCaptainChoice = '';
var chooseTime = 20;

var AFKSet = new Set();
var AFKMinSet = new Set();
var AFKCooldownSet = new Set();

var muteArray = new MuteList();
var muteDuration = 5;

var removingPlayers = false;
var insertingPlayers = false;

var stopTimeout;
var startTimeout;
var unpauseTimeout;
var removingTimeout;
var insertingTimeout;

var emptyPlayer = {
    id: 0,
};
stadiumCommand(emptyPlayer, "!antrenmanmap");

var game = new Game();

/* FUNCTIONS */

function findRegisteredUser(player) {
    // LocalStorage'dan player bilgisi kontrol edilir.
    let playerData = LocalProfilesStorage.getItem(player.name); 
    if (playerData) {
        playerData = JSON.parse(playerData);  // JSON string'i objeye çevir
        return playerData.name;
    }
    return undefined;
}

function isInTheLimits(input, min, max) {
    return min <= input && input <= max;
}

function onJoinProfile(player) {
    // LocalStorage'dan oyuncu verisini kontrol et
    let playerData = LocalProfilesStorage.getItem(player.name);
    if (playerData) {
        playerData = JSON.parse(playerData);  // JSON string'i objeye çevir
    }

    if (!playerData) {
        var otherUserName = findRegisteredUser(player);
        if (otherUserName == undefined) {
            setTimeout(function() {
                room.sendAnnouncement(`🔐 𝗞𝗔𝗬𝗜𝗧 ᴏʟᴍᴀᴢsᴀɴɪᴢ ${loginTimeout} ꜱᴀɴɪʏᴇ ɪᴄᴇʀɪꜱɪɴᴅᴇ ᴀᴛɪʟᴀᴄᴀᴋꜱɪɴɪᴢ. 💎 𝗞𝗔𝗬𝗜𝗧 ɪᴄɪɴ !kayıt şifre`, player.id, darkBlue, "bold", 2);
            }, 3000);
            setTimeout(function() {
                room.sendAnnouncement(`🔐 𝗞𝗔𝗬𝗜𝗧 ᴏʟᴍᴀᴢsᴀɴɪᴢ ${loginTimeout} ꜱᴀɴɪʏᴇ ɪᴄᴇʀɪꜱɪɴᴅᴇ ᴀᴛɪʟᴀᴄᴀᴋꜱɪɴɪᴢ. 💎 𝗞𝗔𝗬𝗜𝗧 ɪᴄɪɴ !kayıt şifre`, player.id, darkBlue, "bold", 2);
            }, 5000);
            setTimeout(function() {
                if (!LocalProfilesStorage.getItem(player.name)) {
                    room.kickPlayer(player.id, "Kaydolmadın. '!kayıt şifre' kullanarak kaydolun", false);
                }
            }, loginTimeout * 1000);
        } else {
            room.kickPlayer(player.id, `Başka bir isimle kaydolmuşsun. Hesap Adı: ${otherUserName}`, false);
        }
    } else {
        if (player.auth === playerData.auth) {
            room.sendAnnouncement(`🔐 ${player.name}, ᴋɪᴍʟɪᴋ ᴅᴏɢʀᴜʟᴀᴍᴀ ʙᴀsᴀʀɪʟɪ.`, player.id, 0x00FF00, "bold", 1);
            playerData.loggedIn = true;
            LocalProfilesStorage.setItem(player.name, JSON.stringify(playerData));  // Objeyi JSON string olarak kaydediyorum :p
        } else {
            setTimeout(function() {
                room.sendAnnouncement(`🔐 ${loginTimeout} sᴀɴɪʏᴇ ɪᴄɪɴᴅᴇ 𝗚𝗜𝗥𝗜𝗦 ʏᴀᴘᴍᴀʟɪsɪɴɪᴢ. 💎 𝗚𝗜𝗥𝗜𝗦 ɪᴄɪɴ !giriş şifre`, player.id, lightBlue, "bold", 2);
            }, 2000);
            setTimeout(function() {
                room.sendAnnouncement(`🔐 ${loginTimeout} sᴀɴɪʏᴇ ɪᴄɪɴᴅᴇ 𝗚𝗜𝗥𝗜𝗦 ʏᴀᴘᴍᴀʟɪsɪɴɪᴢ. 💎 𝗚𝗜𝗥𝗜𝗦 ɪᴄɪɴ !giriş şifre`, player.id, lightBlue, "bold", 2);
            }, 5000);
            setTimeout(function() {
                let updprofile = LocalProfilesStorage.getItem(player.name)
                if (updprofile.loggedIn === false) {
                    room.kickPlayer(player.id, "Giriş yapmadınız. '!giriş şifre' kullanarak giriş yapın.", false);
                } else {
                    LocalProfilesStorage.setItem(player.name, JSON.stringify(playerData)); 
                }
            }, loginTimeout * 1000);
        }
    }
}

function registerCommand(player, message) {
    var splitted = message.split(" ");
    if (splitted.length == 2) {
        var password = splitted[1];
        if (LocalProfilesStorage.getItem(player.name)) {
            room.sendAnnouncement(`🔐 ${player.name}, ᴢᴀᴛᴇɴ ᴋᴀʏıᴛʟıꜱıɴ.`, player.id, errorColor, "bold", 2);
            return false
        }
        if (isInTheLimits(password.length, passwordLengths.min, passwordLengths.max)) {
            room.sendAnnouncement(`🔐 ${player.name}, ᴋᴀʏɪᴛ ʙᴀꜱᴀʀɪʟɪ. ꜱɪꜰʀᴇɴ: ${password}`, player.id, successColor, "bold", 1);

            // Kullanıcıyı LocalStorage'a kaydet
            var playerData = {
                name: player.name,
                auth: authArray[player.name][0], // authArray'deki bilgiyi al
                conn: authArray[player.name][1], // conn bilgisi
                password: password,
                registered: true,
                loggedIn: true
            };
            LocalProfilesStorage.setItem(player.name, JSON.stringify(playerData));  // json olarak kaydediyorum 

            return false;
        } else {
            room.sendAnnouncement(`⚠️ ꜱɪꜰʀᴇɴ ᴍɪɴ ${passwordLengths.min}, ᴍᴀx ${passwordLengths.max} ʜᴀɴᴇ ᴏʟᴍᴀʟıᴅıʀ.`, player.id, errorColor, "bold", 2);
            return false;
        }
    } else { 
        room.sendAnnouncement("⚠️ ʏᴀɴʟɪꜱ ᴋᴏᴍᴜᴛ ᴋᴜʟʟᴀɴɪᴍɪ. 💎 𝗞𝗔𝗬𝗜𝗧 ɪᴄɪɴ !kayıt şifre", player.id, errorColor, "bold", 2);
        return false;
    }
}

function loginCommand(player, message) {
    var splitted = message.split(" ");
    var playerData = LocalProfilesStorage.getItem(player.name);

    if (!playerData) {
        room.sendAnnouncement("⚠️ ᴏɴᴄᴇ ᴋᴀʏɪᴛ ᴏʟᴍᴀʟɪꜱɪɴ. 💎 𝗞𝗔𝗬𝗜𝗧 ɪᴄɪɴ !kayıt şifre", player.id,errorColor, "bold", 2);
        return false;
    }

    playerData = JSON.parse(playerData);  // JSON string'i objeye çeviren kodumuzz

    if (playerData.loggedIn == false) {
        if (splitted.length == 2) {
            var password = splitted[1];
            if (password === playerData.password) {
                room.sendAnnouncement(`🔐 ${player.name}, ᴋɪᴍʟɪᴋ ᴅᴏɢʀᴜʟᴀᴍᴀ ʙᴀsᴀʀɪʟɪ.`, player.id, successColor, "bold", 1);
                playerData.loggedIn = true;
                LocalProfilesStorage.setItem(player.name, JSON.stringify(playerData));  
            } else {
                room.sendAnnouncement("⚠️ ᴋᴜʟʟᴀɴɪᴄɪ ᴀᴅɪ / ꜱɪғʀᴇ ʏᴀɴʟɪꜱ !", player.id, errorColor, "bold", 2);
            }
        } else {
            room.sendAnnouncement("⚠️ ꜱıꜰʀᴇɴ ʙᴏꜱʟᴜᴋ ıᴄᴇʀᴇᴍᴇᴢ", player.id, errorColor, "bold", 2);
        }
    } else {
        room.sendAnnouncement(`🔐 ${player.name}, ᴋɪᴍʟɪᴋ ᴢᴀᴛᴇɴ ᴅᴏɢʀᴜʟᴀɴᴅı.`, player.id, errorColor, "bold", 2);
    }
}


/* AUXILIARY FUNCTIONS */

if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
}

function getDate() {
    let d = new Date();
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

/* MATH FUNCTIONS */

function getRandomInt(max) {
    // 0-1 arasında rastgele sayı
    return Math.floor(Math.random() * Math.floor(max));
}

function pointDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/* TIME FUNCTIONS */

function getHoursStats(time) {
    return Math.floor(time / 3600);
}

function getMinutesGame(time) {
    var t = Math.floor(time / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getMinutesReport(time) {
    return Math.floor(Math.round(time) / 60);
}

function getMinutesEmbed(time) {
    var t = Math.floor(Math.round(time) / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getMinutesStats(time) {
    return Math.floor(time / 60) - getHoursStats(time) * 60;
}

function getSecondsGame(time) {
    var t = Math.floor(time - Math.floor(time / 60) * 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getSecondsReport(time) {
    var t = Math.round(time);
    return Math.floor(t - getMinutesReport(t) * 60);
}

function getSecondsEmbed(time) {
    var t = Math.round(time);
    var t2 = Math.floor(t - Math.floor(t / 60) * 60);
    return `${Math.floor(t2 / 10)}${Math.floor(t2 % 10)}`;
}

function getTimeGame(time) {
    return `[${getMinutesGame(time)}:${getSecondsGame(time)}]`;
}

function getTimeEmbed(time) {
    return `[${getMinutesEmbed(time)}:${getSecondsEmbed(time)}]`;
}

function getTimeStats(time) {
    if (getHoursStats(time) > 0) {
        return `${getHoursStats(time)} saat ${getMinutesStats(time)} dakika`;
    } else {
        return `${getMinutesStats(time)} dakika`;
    }
}

function getGoalGame() {
    return game.scores.red + game.scores.blue;
}

/* REPORT FUNCTIONS */

function findFirstNumberCharString(str) {
    let str_number = str[str.search(/[0-9]/g)];
    return str_number === undefined ? "0" : str_number;
}

function getIdReport() {
    var d = new Date();
    return `${d.getFullYear() % 100}${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}${d.getDate() < 10 ? '0' : ''}${d.getDate()}${d.getHours() < 10 ? '0' : ''}${d.getHours()}${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}${d.getSeconds() < 10 ? '0' : ''}${d.getSeconds()}${findFirstNumberCharString(roomName)}`;
}

function getRecordingName(game) {
    let d = new Date();
    let redCap = game.playerComp[0][0] != undefined ? game.playerComp[0][0].player.name : 'Red';
    let blueCap = game.playerComp[1][0] != undefined ? game.playerComp[1][0].player.name : 'Blue';
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let month = d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let year = d.getFullYear() % 100 < 10 ? '0' + (d.getFullYear() % 100) : (d.getFullYear() % 100);
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    return `${day}-${month}-${year}-${hour}-${minute}-${redCap}-${blueCap}.hbr2`;
}

function fetchRecording(game) {
    if (gameWebhook != "") {
        let form = new FormData();
        form.append(null, new File([game.rec], getRecordingName(game), { "type": "text/plain" }));
        form.append("payload_json", JSON.stringify({
            "username": " Bot"
        }));

        fetch(gameWebhook, {
            method: 'POST',
            body: form,
        }).then((res) => res);
    }
}

/* FEATURE FUNCTIONS */

function getCommand(commandStr) {
    if (commands.hasOwnProperty(commandStr)) return commandStr;
    for (const [key, value] of Object.entries(commands)) {
        for (let alias of value.aliases) {
            if (alias == commandStr) return key;
        }
    }
    return false;
}

function getPlayerComp(player) {
    if (player == null || player.id == 0) return null;
    var comp = game.playerComp;
    var index = comp[0].findIndex((c) => c.auth == authArray[player.name][0]);
    if (index != -1) return comp[0][index];
    index = comp[1].findIndex((c) => c.auth == authArray[player.name][0]);
    if (index != -1) return comp[1][index];
    return null;
}

function getTeamArray(team, includeAFK = true) {
    if (team == Team.RED) return teamRed;
    if (team == Team.BLUE) return teamBlue;
    if (includeAFK) {
      return playersAll.filter((p) => p.team === Team.SPECTATORS);
    }
    return teamSpec;
}

function sendAnnouncementTeam(message, team, color, style, mention) {
    for (let player of team) {
        room.sendAnnouncement(message, player.id, color, style, mention);
    }
}

function teamChat(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    var message = `「𝗧」${player.name}: ${msgArray.join(' ')}`;
    var team = getTeamArray(player.team, true);
    var color = player.team == Team.RED ? redColor : player.team == Team.BLUE ? blueColor : null;
    var style = 'bold';
    var mention = HaxNotification.CHAT;
    sendAnnouncementTeam(message, team, color, style, mention);
}

/* PHYSICS FUNCTIONS */

function calculateStadiumVariables() {
    if (checkStadiumVariable && teamRed.length + teamBlue.length > 0) {
        checkStadiumVariable = false;
        setTimeout(() => {
            let ballDisc = room.getDiscProperties(0);
            let playerDisc = room.getPlayerDiscProperties(teamRed.concat(teamBlue)[0].id);
            ballRadius = ballDisc.radius;
            playerRadius = playerDisc.radius;
            triggerDistance = ballRadius + playerRadius + 0.01;
            speedCoefficient = 100 / (5 * ballDisc.invMass * (ballDisc.damping ** 60 + 1));
        }, 1);
    }
}

function checkGoalKickTouch(array, index, goal) {
    if (array != null && array.length >= index + 1) {
        var obj = array[index];
        if (obj != null && obj.goal != null && obj.goal == goal) return obj;
    }
    return null;
}

/* BUTTONS */

function topButton() {
    if (teamSpec.length > 0) {
        if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
            room.setPlayerTeam(teamSpec[0].id, Team.RED);
            room.setPlayerTeam(teamSpec[1].id, Team.BLUE);
        } else if (teamRed.length < teamBlue.length)
            room.setPlayerTeam(teamSpec[0].id, Team.RED);
        else room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
    }
}

function randomButton() {
    if (teamSpec.length > 0) {
        if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
            var r = getRandomInt(teamSpec.length);
            room.setPlayerTeam(teamSpec[r].id, Team.RED);
            teamSpec = teamSpec.filter((spec) => spec.id != teamSpec[r].id);
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
        } else if (teamRed.length < teamBlue.length)
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.RED);
        else
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
    }
}

function blueToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamBlue.length; i++) {
        room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
    }
}

function redToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamRed.length; i++) {
        room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
    }
}

function resetButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (let i = 0; i < Math.max(teamRed.length, teamBlue.length); i++) {
        if (Math.max(teamRed.length, teamBlue.length) - teamRed.length - i > 0)
            room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
        else if (Math.max(teamRed.length, teamBlue.length) - teamBlue.length - i > 0)
            room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
        else break;
    }
    for (let i = 0; i < Math.min(teamRed.length, teamBlue.length); i++) {
        room.setPlayerTeam(
            teamBlue[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
            Team.SPECTATORS
        );
        room.setPlayerTeam(
            teamRed[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
            Team.SPECTATORS
        );
    }
}

function swapButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (let player of teamBlue) {
        room.setPlayerTeam(player.id, Team.RED);
    }
    for (let player of teamRed) {
        room.setPlayerTeam(player.id, Team.BLUE);
    }
}

/* COMMAND FUNCTIONS */

/* PLAYER COMMANDS */

function leaveCommand(player, message) {
    room.kickPlayer(player.id, 'Görüşürüz !', false);
}

function helpCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
        var commandString = '🔷 𝗞𝗢𝗠𝗨𝗧𝗟𝗔𝗥: ';
        // Oyuncu komutlarını ekle
        for (const [key, value] of Object.entries(commands)) {
            if (value.desc && value.roles == Role.PLAYER) {
                commandString += ` !${key},`;
            }
        }
        commandString = commandString.substring(0, commandString.length - 1) + '.\n';

        // Admin kontrolü (admin komutlarını görmek için mesaj)
        if (getRole(player) >= Role.ADMIN_TEMP) {
            commandString += `🔷 Moderatör komutlarını görmek için !moderatorkomutları kullan.\n`;
        }

        // Master kontrolü (master komutlarını görmek için mesaj)
        if (getRole(player) >= Role.MASTER) {
            commandString += `🔷 Yönetici komutlarını görmek için !yöneticikomutları kullan.`;
        }

        room.sendAnnouncement(
            commandString,
            player.id,
            successColor,
            'normal',
            HaxNotification.CHAT
        );
    }
}
function modCommands(player, message) {
    if (getRole(player) >= Role.ADMIN_TEMP) {
        var commandString = '🔷 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗢𝗥 𝗞𝗢𝗠𝗨𝗧𝗟𝗔𝗥𝗜: ';
        for (const [key, value] of Object.entries(commands)) {
            if (value.desc && value.roles == Role.ADMIN_TEMP) {
                commandString += ` !${key},`;
            }
        }
        if (commandString.slice(commandString.length - 1) == ':') {
            commandString += ' None,';
        }
        commandString = commandString.substring(0, commandString.length - 1) + '.';
        room.sendAnnouncement(
            commandString,
            player.id,
            successColor,
            'normal',
            HaxNotification.CHAT
        );
    }
}

function yöneticiCommands(player, message) {
    if (getRole(player) >= Role.MASTER) {
        var commandString = '🔷 𝗬𝗢𝗡𝗘𝗧𝗜𝗖𝗜 𝗞𝗢𝗠𝗨𝗧𝗟𝗔𝗥𝗜: ';
        for (const [key, value] of Object.entries(commands)) {
            if (value.desc && value.roles == Role.MASTER) {
                commandString += ` !${key},`;
            }
        }
        if (commandString.slice(commandString.length - 1) == ':') {
            commandString += ' None,';
        }
        commandString = commandString.substring(0, commandString.length - 1) + '.';
        room.sendAnnouncement(
            commandString,
            player.id,
            successColor,
            'normal',
            HaxNotification.CHAT
        );
    }
}

function rutbeCommand(player) {
    let stats = new HaxStatistics(player.name);
    
    // Eğer player'ın local stats'leri varsa, yükle
    if (LocalStatsStorage.getItem(player.name)) {
        stats = JSON.parse(LocalStatsStorage.getItem(player.name));
    }

    // Eğer oyuncunun istatistikleri yoksa veya puanı 0 ise "ᴋᴀʏɪᴛꜱɪᴢ" dön
    if (!stats || stats.games === 0) {
        return "ʀᴜᴛʙᴇꜱɪᴢ";
    }

    // Yenilgiyi ve Puanı hesapla
    let losses = stats.games - stats.wins;
    let points = (stats.wins * 15) + (losses * -10) + (stats.goals * 5) + (stats.assists * 3) + (stats.ownGoals * -3) + (stats.CS * 5);

    // Rütbe hesaplama
    let rank = '';
    if (points <= 500) {
        rank = 'ᴀɢɪʀ ᴀᴄᴇᴍɪ';
    } else if (points <= 1000) {
        rank = 'ᴀᴄᴇᴍɪ';
    } else if (points <= 2000) {
        rank = 'ᴏʀᴛᴀ';
    } else if (points <= 5000) {
        rank = 'ᴘʀᴏ';
    } else if (points <= 10000000) {
        rank = 'ʜᴘ';
    } else {
        rank = "ʀᴜᴛʙᴇꜱɪᴢ";
    }

    return rank;
}


function globalStatsCommand(player, message) {
    var stats = new HaxStatistics(player.name);
    
    // Eğer player'ın local stats'leri varsa, yükle
    if (LocalStatsStorage.getItem(player.name)) {
        stats = JSON.parse(LocalStatsStorage.getItem(player.name));
    }

    if (!stats) {
        room.sendAnnouncement(
            "⚠️ Yeterince oyun oynamadın.",
            player.id,
            errorColor,
            'bold',
            2
        );
        return false
    }

    // Yenilgiyi ve Puanı hesapla
    let losses = stats.games - stats.wins;
    let points = (stats.wins * 15) + (losses * -10) + (stats.goals * 5) + (stats.assists * 3) + (stats.ownGoals * -3) + (stats.CS * 5);
    
    // Galibiyet oranını hesapla
    let winrate = ((stats.wins / stats.games) * 100).toFixed(2);

    // Tüm oyuncuları localStorage'dan al ve sıralama yap
    let leaderboard = [];
    for (let i = 0; i < LocalStatsStorage.length; i++) {
        let key = LocalStatsStorage.key(i); // Anahtarı al
        let playerStats = JSON.parse(LocalStatsStorage.getItem(key)); // Anahtarı kullanarak veriyi al
    
        // Verinin boş olup olmadığını kontrol et
        if (playerStats && playerStats.playerName) {
            let losses = playerStats.games - playerStats.wins;
            let points = (playerStats.wins * 15) + (losses * -10) + (playerStats.goals * 5) + (playerStats.assists * 3) + (playerStats.ownGoals * -3) + (playerStats.CS * 5);
    
            leaderboard.push({ playerName: playerStats.playerName, points: points });
        }
    }
    
    // Sıralama yap
    leaderboard.sort((a, b) => b.points - a.points);
    
    // Sıralamada oyuncunun yerini bul
    let rank = leaderboard.findIndex(player => player.playerName === stats.playerName) + 1; // oyuncunun adını kullanarak sıralamayı bul
    

    // Output formatı
    let statsString = 
`📈@${stats.playerName}・⚽️Galibiyet: ${stats.wins}・🔻Mağlubiyet: ${losses}・⚽Gol: ${stats.goals}・👟Ass: ${stats.assists}
📈@${stats.playerName}・⚽️${stats.games} Maç・🔰%${winrate} Galibiyet Oranı・😢ᴋᴋ: ${stats.ownGoals}・🧤CS: ${stats.CS}
📈@${stats.playerName}・🅿️Puanın: ${points} ・ 🏆Sıralaman: ${rank}/${leaderboard.length} ・ ʀᴜᴛʙᴇɴ: ${rutbeCommand(player)}`;

    // Duyuru yap
    room.sendAnnouncement(
        statsString,
        null,
        0xb1bff9,
        'bold',
        2
    );
}

function statsLeaderboardCommand(player, message) {
    var commandMap = {
        "ençokoynayanlar": "games",
        "ençokkazananlar": "wins",
        "golkrallığı": "goals",
        "asistkrallığı": "assists",
        "eniyikaleciler": "CS",
        "enaktifler": "playtime"
    };
    var key = message.split(/ +/)[0].substring(1).toLowerCase();
    printRankings(commandMap[key], player.id);
}

function afkCommand(player, message) {
    if (player.team == Team.SPECTATORS || players.length == 1) {
        if (AFKSet.has(player.id)) {
            if (AFKMinSet.has(player.id)) {
                room.sendAnnouncement(
                    `⚠️ Minimum ${minAFKDuration} dakika AFK kalmalısın !`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                AFKSet.delete(player.id);
                room.sendAnnouncement(
                    `🥱 ${player.name} artık AFK değil !`,
                    null,
                    announcementColor,
                    'bold',
                    null
                );
                updateTeams();
                handlePlayersJoin();
            }
        } else {
            if (AFKCooldownSet.has(player.id)) {
                room.sendAnnouncement(
                    `⚠️ Sadece her ${AFKCooldown} dakikada bir AFK kalabilirsin !`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                AFKSet.add(player.id);
                if (!player.admin) {
                    AFKMinSet.add(player.id);
                    AFKCooldownSet.add(player.id);
                    setTimeout(
                        (id) => {
                            AFKMinSet.delete(id);
                        },
                        minAFKDuration * 60 * 1000,
                        player.id
                    );
                    setTimeout(
                        (id) => {
                            AFKSet.delete(id);
                        },
                        maxAFKDuration * 60 * 1000,
                        player.id
                    );
                    setTimeout(
                        (id) => {
                            AFKCooldownSet.delete(id);
                        },
                        AFKCooldown * 60 * 1000,
                        player.id
                    );
                }
                room.setPlayerTeam(player.id, Team.SPECTATORS);
                room.sendAnnouncement(
                    `😴 ${player.name} AFK !`,
                    null,
                    announcementColor,
                    'bold',
                    null
                );
                updateTeams();
                handlePlayersLeave();
            }
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Bir takımdayken AFK kalamazsın !`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function afkListCommand(player, message) {
    if (AFKSet.size == 0) {
        room.sendAnnouncement(
            "😴 AFK oyuncu yok.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return;
    }
    var cstm = '😴 AFK Oyuncular : ';
    AFKSet.forEach((_, value) => {
        var p = room.getPlayer(value);
        if (p != null) cstm += p.name + `, `;
    });
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null);
}

function masterCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (parseInt(msgArray[0]) == masterPassword) {
        if (!masterList.includes(authArray[player.name][0])) {
            room.setPlayerAdmin(player.id, true);
            adminList = adminList.filter((a) => a[0] != authArray[player.name][0]);
            masterList.push(authArray[player.name][0]);
            room.sendAnnouncement(
                `🌐 ${player.name} isimli oyuncuya YÖNETİCİ yetkisi verildi.`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `⚠️ Zaten YÖNETİCİ yetkin var.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
    listeleriGüncelle()    
}

/* ADMIN COMMANDS */

function restartCommand(player, message) {
    instantRestart();
}

function restartSwapCommand(player, message) {
    room.stopGame();
    swapButton();
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 10);
}

function swapCommand(player, message) {
    if (playSituation == Situation.STOP) {
        swapButton();
        room.sendAnnouncement(
            '✅ Takımlar değiştirildi.',
            null,
            announcementColor,
            'bold',
            null
        );
    } else {
        room.sendAnnouncement(
            `⚠️ Bu komutu kullanmadan önce oyunu durdurmalısın.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function kickTeamCommand(player, message) {
    var msgArray = message.split(/ +/);
    var reasonString = `Takım ${player.name} isimli yetkili tarafından atıldı.`;
    if (msgArray.length > 1) {
        reasonString = msgArray.slice(1).join(' ');
    }
    if (['!kırmızıtakımıat', '!kickr'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamRed.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamRed[0].id, reasonString, false);
            }, i * 20)
        }
    } else if (['!mavitakımıat', '!kickb'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamBlue.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamBlue[0].id, reasonString, false);
            }, i * 20)
        }
    } else if (['!izleyicileriat', '!kicks'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamSpec.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamSpec[0].id, reasonString, false);
            }, i * 20)
        }
    }
}

function stadiumCommand(player, message) {
    var msgArray = message.split(/ +/);
    if (gameState == State.STOP) {
        if (['!küçükmap'].includes(msgArray[0].toLowerCase())) {
            room.setCustomStadium(classicMap);
            room.sendAnnouncement("✔️ v1-v2 Futsal ᴀᴄɪʟɪʏᴏʀ.",null,successColor,"bold",1)
            currentStadium = 'küçükmap';
        } else if (['!büyükmap'].includes(msgArray[0].toLowerCase())) {
            room.setCustomStadium(bigMap);
            room.sendAnnouncement("✔️ v3 Futsal ᴀᴄɪʟɪʏᴏʀ.",null,successColor,"bold",1)
            currentStadium = 'büyükmap';
        } else if (['!antrenmanmap'].includes(msgArray[0].toLowerCase())) {
            room.setCustomStadium(trainingMap);
            room.sendAnnouncement("✔️ Antrenman ᴀᴄɪʟɪʏᴏʀ.",null,successColor,"bold",1)
            currentStadium = 'antrenmanmap';
        } else {
            room.sendAnnouncement(
                `⚠️ Stadyum dosyası tanınmadı.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Bu komutu kullanmadan önce oyunu durdurmalısın.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function muteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerMute = room.getPlayer(parseInt(msgArray[0]));
                var minutesMute = muteDuration;
                if (msgArray.length > 1 && parseInt(msgArray[1]) > 0) {
                    minutesMute = parseInt(msgArray[1]);
                }
                if (!playerMute.admin) {
                    var muteObj = new MutePlayer(playerMute.name, playerMute.id, authArray[playerMute.name][0]);
                    muteObj.setDuration(minutesMute);
                    room.sendAnnouncement(
                        `🔇 ${playerMute.name},  ${minutesMute} dakika susturuldu.`,
                        null,
                        announcementColor,
                        'bold',
                        null
                    );
                } else {
                    room.sendAnnouncement(
                        `⚠️ Bir admini susturamazsın.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `⚠️ Odada bu ID ye sahip bir oyuncu yok.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `⚠️ Hatalı komut kullanımı.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Hatalı komut kullanımı.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function unmuteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerUnmute = room.getPlayer(parseInt(msgArray[0]));
                if (muteArray.getByPlayerId(playerUnmute.id) != null) {
                    var muteObj = muteArray.getByPlayerId(playerUnmute.id);
                    muteObj.remove()
                    room.sendAnnouncement(
                        `🔊 ${playerUnmute.name} isimli oyuncunun susturulma cezası kaldırıldı !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.sendAnnouncement(
                        `⚠️ Bu oyuncu susturulmamış !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `⚠️ Odada bu ID ye sahip bir oyuncu yok.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) > 0 && muteArray.getById(parseInt(msgArray[0])) != null) {
            var playerUnmute = muteArray.getById(parseInt(msgArray[0]));
            playerUnmute.remove();
            room.sendAnnouncement(
                `🔊 ${playerUnmute.name} isimli oyuncunun susturulma cezası kaldırıldı !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `⚠️ Hatalı komut kullanımı.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Hatalı komut kullanımı.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function muteListCommand(player, message) {
    if (muteArray.list.length == 0) {
        room.sendAnnouncement(
            "🔇 Cezalı oyuncu bulunamadı.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '🔇 Muteli Oyuncular : ';
    for (let mute of muteArray.list) {
        cstm += mute.name + `[${mute.id}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

/* MASTER COMMANDS */

function clearbansCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
        room.clearBans();
        room.sendAnnouncement(
            '✅ Banlar temizlendi.',
            null,
            announcementColor,
            'bold',
            null
        );
        banList = [];
    } else if (msgArray.length == 1) {
        if (parseInt(msgArray[0]) > 0) {
            var ID = parseInt(msgArray[0]);
            room.clearBan(ID);
            if (banList.length != banList.filter((p) => p[1] != ID).length) {
                room.sendAnnouncement(
                    `✅ ${banList.filter((p) => p[1] == ID)[0][0]} isimli oyuncunun banı kaldırıldı !`,
                    null,
                    announcementColor,
                    'bold',
                    null
                );
            } else {
                room.sendAnnouncement(
                    `⚠️ Bu ID ile ilişkili bir yasaklama yok.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            banList = banList.filter((p) => p[1] != ID);
        } else {
            room.sendAnnouncement(
                `⚠️ Hatalı ID`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Hatalı komut kullanımı.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function banListCommand(player, message) {
    if (banList.length == 0) {
        room.sendAnnouncement(
            "📢 Banlanmış oyuncu yok.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '📢 Banlı Oyuncular : ';
    for (let ban of banList) {
        cstm += ban[0] + `[${ban[1]}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

function adminListCommand(player, message) {
    if (adminList.length == 0) {
        room.sendAnnouncement(
            "📢 Moderatör bulunamadı :",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '📢 Moderatörler : ';
    for (let i = 0; i < adminList.length; i++) {
        cstm += adminList[i][1] + `[${i}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

function setAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                if (!adminList.map((a) => a[0]).includes(authArray[playerAdmin.name][0])) {
                    if (!masterList.includes(authArray[playerAdmin.name][0])) {
                        room.setPlayerAdmin(playerAdmin.id, true);
                        adminList.push([authArray[playerAdmin.name][0], playerAdmin.name]);
                        room.sendAnnouncement(
                            `🌐 ${playerAdmin.name} isimli oyuncu MODERATOR yetkisi aldı !`,
                            null,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.sendAnnouncement(
                            `⚠️ Bu oyuncunun zaten YÖNETİCİ yetkisi var !`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `⚠️ Bu oyuncu zaten MODERATOR !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `⚠️ Odada bu ID ye sahip bir oyuncu yok.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `⚠️ Hatalı komut kullanımı.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Hatalı komut kullanımı.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    
    listeleriGüncelle()
}

function removeAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                if (adminList.map((a) => a[0]).includes(authArray[playerAdmin.name][0])) {
                    room.setPlayerAdmin(playerAdmin.id, false);
                    adminList = adminList.filter((a) => a[0] != authArray[playerAdmin.name][0]);
                    room.sendAnnouncement(
                        `🌐 ${playerAdmin.name} isimli oyuncunun MODERATOR yetkisi alındı !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.sendAnnouncement(
                        `⚠️ Bu oyuncunun MODERATOR yetkisi yok !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `⚠️ Odada bu ID ye sahip bir oyuncu yok.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) < adminList.length) {
            var index = parseInt(msgArray[0]);
            var playerAdmin = adminList[index];
            if (playersAll.findIndex((p) => authArray[p.name][0] == playerAdmin[0]) != -1) {
                // check if there is the removed admin in the room
                var indexRem = playersAll.findIndex((p) => authArray[p.name][0] == playerAdmin[0]);
                room.setPlayerAdmin(playersAll[indexRem].id, false);
            }
            adminList.splice(index,1);
            room.sendAnnouncement(
                `🌐 ${playerAdmin[1]} isimli oyuncunun MODERATOR yetkisi alındı !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `⚠️ Hatalı komut kullanımı.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `⚠️ Hatalı komut kullanımı.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    listeleriGüncelle()
}

function passwordCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray.length == 1 && msgArray[0] == '') {
            roomPassword = '';
            room.setPassword(null);
            room.sendAnnouncement(
                `🔑 Oda şifresi kaldırıldı.`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
        roomPassword = msgArray.join(' ');
        room.setPassword(roomPassword);
        room.sendAnnouncement(
            `🔑 Odaya şifre konuldu: ${roomPassword}`,
            player.id,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        if (roomPassword != '') {
            roomPassword = '';
            room.setPassword(null);
            room.sendAnnouncement(
                `🔑 Oda şifresi kaldırıldı.`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `⚠️ Odanın şuan bir şifresi yok.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
}

/* GAME FUNCTIONS */

function checkTime() {
    const scores = room.getScores();
    if (game != undefined) game.scores = scores;
    if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0 && playSituation == Situation.PLAY) {
        if (scores.red != scores.blue) {
            if (!checkTimeVariable) {
                checkTimeVariable = true;
                setTimeout(() => {
                    checkTimeVariable = false;
                }, 3000);
                scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
                stopTimeout = setTimeout(() => {
                    room.stopGame();
                }, 2000);
            }
            return;
        }
        if (drawTimeLimit != 0) {
            goldenGoal = true;
            room.sendAnnouncement(
                '📢 Skorlar eşit. İlk golü atan kazanacak!',
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
    if (Math.abs(scores.time - drawTimeLimit * 60 - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
        if (!checkTimeVariable) {
            checkTimeVariable = true;
            setTimeout(() => {
                checkTimeVariable = false;
            }, 10);
            endGame(Team.SPECTATORS);
            room.stopGame();
            goldenGoal = false;
        }
    }
}

function instantRestart() {
    room.stopGame();
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 10);
}

function resumeGame() {
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 1000);
    setTimeout(() => {
        room.pauseGame(false);
    }, 500);
}

function endGame(winner) {
    if (players.length >= 2 * teamSize - 1) activateChooseMode();
    const scores = room.getScores();
    game.scores = scores;
    lastWinner = winner;
    endGameVariable = true;
    let possessionRedPct = (possession[0] / (possession[0] + possession[1])) * 100;
    let possessionBluePct = 100 - possessionRedPct;
    let possessionString = `🔴 ${possessionRedPct.toFixed(0)}% ⚔️ ${possessionBluePct.toFixed(0)}% 🔵`;
    let actionRedPct = (actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])) * 100;
    let actionBluePct = 100 - actionRedPct;
    let actionString = `🔴 ${actionRedPct.toFixed(0)}% ⚔️ ${actionBluePct.toFixed(0)}% 🔵`;

    var totalPasses = Math.floor(Math.random() * 11) + 25;
    var possR = possession[0] / (possession[0] + possession[1]); 
    var passesRed = Math.round(totalPasses * possR); 
    var passesBlue = totalPasses - passesRed;
    let passString = `🔴 ${passesRed} ⚔️ ${passesBlue} 🔵`;

    let CSString = getCSString(scores);
    room.sendAnnouncement(
        `█📊 ᴛᴏᴘᴀ sᴀʜɪᴘ ᴏʟᴍᴀ ${possessionString}\n` +
        `█📈 ɪꜱɪ ʜᴀʀɪᴛᴀꜱɪ  ${actionString}\n` +
        `█📉 ᴘᴀꜱ ʜᴀʀɪᴛᴀꜱɪ  ${passString}\n` +
        `${CSString}`,
        null,
        0xff8901,
        'bold',
        HaxNotification.NONE
    );
    if (winner == Team.RED) {
        streak++;
        room.sendAnnouncement(
            `🔴 𝐾𝐼𝑅𝑀𝐼𝑍𝐼 ${streak} ᴍᴀᴄᴛɪʀ ᴋᴀᴢᴀɴɪʏᴏʀ.`,
            null,
            0xb1bff9,
            'bold',
            HaxNotification.CHAT
        );
    } else if (winner == Team.BLUE) {
        streak = 1;
        room.sendAnnouncement(
            `🔵 𝑀𝐴𝑉𝐼̇ ${streak} ᴍᴀᴄᴛɪʀ ᴋᴀᴢᴀɴɪʏᴏʀ.`,
            null,
            0xb1bff9,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        streak = 0;
        room.sendAnnouncement(
            '💤 𝑀𝑎𝑐 𝐵𝑒𝑟𝑎𝑏𝑒𝑟𝑒 𝐵𝑖𝑡𝑡𝑖',
            null,
            0xb1bff9,
            'bold',
            HaxNotification.CHAT
        );
    }
    updateStats();
}

/* CHOOSING FUNCTIONS */

function activateChooseMode() {
    chooseMode = true;
    slowMode = chooseModeSlowMode;
    room.sendAnnouncement(
        `📢 Eksik oyuncular var. Lütfen oyuncu seçin.`,
        null,
        announcementColor,
        'bold',
        HaxNotification.CHAT
    );
}

function deactivateChooseMode() {
    chooseMode = false;
    clearTimeout(timeOutCap);
    if (slowMode != defaultSlowMode) {
        slowMode = defaultSlowMode;
    }
    redCaptainChoice = '';
    blueCaptainChoice = '';
}

function getSpecList(player) {
    if (player == null) return null;
    var cstm = 'Oyuncular : ';
    for (let i = 0; i < teamSpec.length; i++) {
        cstm += teamSpec[i].name + `[${i + 1}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
}

function choosePlayer() {
    clearTimeout(timeOutCap);
    let captain;
    if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
        captain = teamRed[0];
    } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
        captain = teamBlue[0];
    }
    if (captain != null) {
        room.sendAnnouncement(
            "📢 Bir oyuncu seçmek için oyuncunun listede verilen numarasını gir yada 'random' yazarak rastgele seç.",
            captain.id,
            infoColor,
            'bold',
            HaxNotification.MENTION
        );
        timeOutCap = setTimeout(
            (player) => {
                room.sendAnnouncement(
                    `⛔ Acele et ${player.name}, oyuncu seçmek için sadece ${Number.parseInt(String(chooseTime / 2))} saniyen kalıd !`,
                    player.id,
                    warningColor,
                    'bold',
                    HaxNotification.MENTION
                );
                timeOutCap = setTimeout(
                    (player) => {
                        room.kickPlayer(
                            player.id,
                            "Oyuncu seçmediğin için atıldın !",
                            false
                        );
                    },
                    chooseTime * 500,
                    captain
                );
            },
            chooseTime * 1000,
            captain
        );
    }
    if (teamRed.length != 0 && teamBlue.length != 0) {
        getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
}

function chooseModeFunction(player, message) {
    var msgArray = message.split(/ +/);
    if (player.id == teamRed[0].id || player.id == teamBlue[0].id) {
        if (teamRed.length <= teamBlue.length && player.id == teamRed[0].id) {
            if (['top', 'auto'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
                redCaptainChoice = 'top';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} oyuncu seçti !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['random', 'rand'].includes(msgArray[0].toLowerCase())) {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
                redCaptainChoice = 'random';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `📢 ${player.name} isimli oyuncu rastgele oyuncu seçti !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['bottom', 'bot'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
                redCaptainChoice = 'bottom';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} oyuncu seçti !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                    room.sendAnnouncement(
                        `⚠️ Hatalı numara !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.setPlayerTeam(
                        teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                        Team.RED
                    );
                    room.sendAnnouncement(
                        `📢 ${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} isimli oyuncuyu seçti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else return false;
            return true;
        }
        if (teamRed.length > teamBlue.length && player.id == teamBlue[0].id) {
            if (['top', 'auto'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                blueCaptainChoice = 'top';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} oyuncu seçti !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['random', 'rand'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(
                    teamSpec[getRandomInt(teamSpec.length)].id,
                    Team.BLUE
                );
                blueCaptainChoice = 'random';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `📢 ${player.name} isimli oyuncu rastgele oyuncu seçti !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['bottom', 'bot'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
                blueCaptainChoice = 'bottom';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} oyuncu seçti !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                    room.sendAnnouncement(
                        `⚠️ Hatalı numara !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.setPlayerTeam(
                        teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                        Team.BLUE
                    );
                    room.sendAnnouncement(
                        `📢 ${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} isimli oyuncuyu seçti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else return false;
            return true;
        }
    }
}

function checkCaptainLeave(player) {
    if (
        (teamRed.findIndex((red) => red.id == player.id) == 0 && chooseMode && teamRed.length <= teamBlue.length) ||
        (teamBlue.findIndex((blue) => blue.id == player.id) == 0 && chooseMode && teamBlue.length < teamRed.length)
    ) {
        choosePlayer();
        capLeft = true;
        setTimeout(() => {
            capLeft = false;
        }, 10);
    }
}

function slowModeFunction(player, message) {
    if (!player.admin) {
        if (!SMSet.has(player.id)) {
            SMSet.add(player.id);
            setTimeout(
                (number) => {
                    SMSet.delete(number);
                },
                slowMode * 1000,
                player.id
            );
        } else {
            return true;
        }
    }
    return false;
}

/* PLAYER FUNCTIONS */

function updateTeams() {
    playersAll = room.getPlayerList();
    players = playersAll.filter((p) => !AFKSet.has(p.id));
    teamRed = players.filter((p) => p.team == Team.RED);
    teamBlue = players.filter((p) => p.team == Team.BLUE);
    teamSpec = players.filter((p) => p.team == Team.SPECTATORS);
}

function updateAdmins(excludedPlayerID = 0) {
    if (players.length != 0 && players.filter((p) => p.admin).length < maxAdmins) {
        let playerArray = players.filter((p) => p.id != excludedPlayerID && !p.admin);
        let arrayID = playerArray.map((player) => player.id);
        room.setPlayerAdmin(Math.min(...arrayID), true);
    }
}

function getRole(player) {
    return (
        !!masterList.find((a) => a == authArray[player.name][0]) * 2 +
        !!adminList.find((a) => a[0] == authArray[player.name][0]) * 1 +
        player.admin * 1
    );
}

function ghostKickHandle(oldP, newP) {
    var teamArrayId = getTeamArray(oldP.team, true).map((p) => p.id);
    teamArrayId.splice(teamArrayId.findIndex((id) => id == oldP.id), 1, newP.id);

    room.kickPlayer(oldP.id, 'Aynı IP üzerinden giriş tespit edildi. Oyuncu uzaklaştırıldı.', true);
    room.setPlayerTeam(newP.id, oldP.team);
    room.setPlayerAdmin(newP.id, oldP.admin);
    room.reorderPlayers(teamArrayId, true);

    if (oldP.team != Team.SPECTATORS && playSituation != Situation.STOP) {
        var discProp = room.getPlayerDiscProperties(oldP.id);
        room.setPlayerDiscProperties(newP.id, discProp);
    }
}

/* ACTIVITY FUNCTIONS */

function handleActivityPlayer(player) {
    let pComp = getPlayerComp(player);
    if (pComp != null) {
        pComp.inactivityTicks++;
        if (pComp.inactivityTicks == 60 * ((2 / 3) * afkLimit)) {
            room.sendAnnouncement(
                `📣 @${player.name}, ʜᴀʀᴇᴋᴇᴛ ᴇᴛᴍᴇᴢsᴇɴ ᴠᴇʏᴀ ᴍᴇsᴀᴊ ʏᴀᴢᴍᴀᴢsᴀɴ ${Math.floor(afkLimit / 3)} sᴀɴɪʏᴇ ɪᴄɪɴᴅᴇ, ᴏᴅᴀᴅᴀɴ ᴀᴛɪʟᴀᴄᴀᴋsɪɴ.`,
                player.id,
                null,
                'normal',
                HaxNotification.MENTION
            );
            return;
        }
        if (pComp.inactivityTicks >= 60 * afkLimit) {
            pComp.inactivityTicks = 0;
            if (game.scores.time <= afkLimit - 0.5) {
                setTimeout(() => {
                    !chooseMode ? instantRestart() : room.stopGame();
                }, 10);
            }
            room.kickPlayer(player.id, 'AFK', false);
        }
    }
}

function handleActivityPlayerTeamChange(changedPlayer) {
    if (changedPlayer.team == Team.SPECTATORS) {
        let pComp = getPlayerComp(changedPlayer);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
}

function handleActivityStop() {
    for (let player of players) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
}

function handleActivity() {
    if (gameState === State.PLAY && players.length > 1) {
        for (let player of teamRed) {
            handleActivityPlayer(player);
        }
        for (let player of teamBlue) {
            handleActivityPlayer(player);
        }
    }
}

/* LINEUP FUNCTIONS */

function getStartingLineups() {
    var compositions = [[], []];
    for (let player of teamRed) {
        compositions[0].push(
            new PlayerComposition(player, authArray[player.name][0], [0], [])
        );
    }
    for (let player of teamBlue) {
        compositions[1].push(
            new PlayerComposition(player, authArray[player.name][0], [0], [])
        );
    }
    return compositions;
}

function handleLineupChangeTeamChange(changedPlayer) {
    if (gameState != State.STOP) {
        var playerLineup;
        if (changedPlayer.team == Team.RED) {
            // player gets in red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.name][0]);
            if (ind != -1) {
                // Player goes back in
                playerLineup = game.playerComp[0][ind];
                if (playerLineup.timeExit.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    playerLineup.timeExit = playerLineup.timeExit.filter((t) => t != game.scores.time);
                } else {
                    playerLineup.timeEntry.push(game.scores.time);
                }
            } else {
                playerLineup = new PlayerComposition(
                    changedPlayer,
                    authArray[changedPlayer.name][0],
                    [game.scores.time],
                    []
                );
                game.playerComp[0].push(playerLineup);
            }
        } else if (changedPlayer.team == Team.BLUE) {
            // player gets in blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.name][0]);
            if (ind != -1) {
                // Player goes back in
                playerLineup = game.playerComp[1][ind];
                if (playerLineup.timeExit.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    playerLineup.timeExit = playerLineup.timeExit.filter((t) => t != game.scores.time);
                } else {
                    playerLineup.timeEntry.push(game.scores.time);
                }
            } else {
                playerLineup = new PlayerComposition(
                    changedPlayer,
                    authArray[changedPlayer.name][0],
                    [game.scores.time],
                    []
                );
                game.playerComp[1].push(playerLineup);
            }
        }
        if (teamRed.some((r) => r.id == changedPlayer.id)) {
            // player leaves red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.name][0]);
            playerLineup = game.playerComp[0][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[0].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        } else if (teamBlue.some((r) => r.id == changedPlayer.id)) {
            // player leaves blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.name][0]);
            playerLineup = game.playerComp[1][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[1].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        }
    }
}

function handleLineupChangeLeave(player) {
    if (playSituation != Situation.STOP) {
        if (player.team == Team.RED) {
            // player gets in red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[player.name][0]);
            var playerLineup = game.playerComp[0][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[0].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        } else if (player.team == Team.BLUE) {
            // player gets in blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[player.name][0]);
            var playerLineup = game.playerComp[1][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[1].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        }
    }
}

/* TEAM BALANCE FUNCTIONS */

function balanceTeams() {
    if (!chooseMode) {
        if (players.length == 0) {
            room.stopGame();
            room.setScoreLimit(scoreLimit);
            room.setTimeLimit(timeLimit);
        } else if (players.length == 1 && teamRed.length == 0) {
            instantRestart();
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!antrenmanmap`);
            }, 5);
            room.setPlayerTeam(players[0].id, Team.RED);
        } else if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length && teamSpec.length > 0) {
            const n = Math.abs(teamRed.length - teamBlue.length);
            if (players.length == 2) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!küçükmap`);
                }, 5);
            }
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamSpec[i].id, Team.BLUE);
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamSpec[i].id, Team.RED);
                }
            }
        } else if (Math.abs(teamRed.length - teamBlue.length) > teamSpec.length) {
            const n = Math.abs(teamRed.length - teamBlue.length);
            if (players.length == 1) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!antrenmanmap`);
                }, 5);
                room.setPlayerTeam(players[0].id, Team.RED);
                return;
            } else if (teamSize > 2 && players.length == 5) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!küçükmap`);
                }, 5);
            }
            if (players.length == teamSize * 2 - 1) {
                teamRedStats = [];
                teamBlueStats = [];
            }
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamRed[teamRed.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamBlue[teamBlue.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            }
        } else if (Math.abs(teamRed.length - teamBlue.length) < teamSpec.length && teamRed.length != teamBlue.length) {
            room.pauseGame(true);
            activateChooseMode();
            choosePlayer();
        } else if (teamSpec.length >= 2 && teamRed.length == teamBlue.length && teamRed.length < teamSize) {
            if (teamRed.length == 2) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!büyükmap`);
                }, 5);
            }
            topButton();
        }
    }
}

function handlePlayersJoin() {
    if (chooseMode) {
        if (teamSize > 2 && players.length == 6) {
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!büyükmap`);
            }, 5);
        }
        getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
    balanceTeams();
}

function handlePlayersLeave() {
    if (gameState != State.STOP) {
        var scores = room.getScores();
        if (players.length >= 2 * teamSize && scores.time >= (5 / 6) * game.scores.timeLimit && teamRed.length != teamBlue.length) {
            var rageQuitCheck = false;
            if (teamRed.length < teamBlue.length) {
                if (scores.blue - scores.red == 2) {
                    endGame(Team.BLUE);
                    rageQuitCheck = true;
                }
            } else {
                if (scores.red - scores.blue == 2) {
                    endGame(Team.RED);
                    rageQuitCheck = true;
                }
            }
            if (rageQuitCheck) {
                room.sendAnnouncement(
                    "📢 Bir oyuncu oyundan kaçtı. Oyuncu cezalandırıldı.",
                    null,
                    infoColor,
                    'bold',
                    HaxNotification.MENTION
                )
                stopTimeout = setTimeout(() => {
                    room.stopGame();
                }, 100);
                return;
            }
        }
    }
    if (chooseMode) {
        if (teamSize > 2 && players.length == 5) {
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!küçükmap`);
            }, 5);
        }
        if (teamRed.length == 0 || teamBlue.length == 0) {
            room.setPlayerTeam(teamSpec[0].id, teamRed.length == 0 ? Team.RED : Team.BLUE);
            return;
        }
        if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
            deactivateChooseMode();
            resumeGame();
            var b = teamSpec.length;
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            } else {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            }
            return;
        }
        if (streak == 0 && gameState == State.STOP) {
            if (Math.abs(teamRed.length - teamBlue.length) == 2) {
                var teamIn = teamRed.length > teamBlue.length ? teamRed : teamBlue;
                room.setPlayerTeam(teamIn[teamIn.length - 1].id, Team.SPECTATORS)
            }
        }
        if (teamRed.length == teamBlue.length && teamSpec.length < 2) {
            deactivateChooseMode();
            resumeGame();
            return;
        }

        if (capLeft) {
            choosePlayer();
        } else {
            getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
        }
    }
    balanceTeams();
}

function handlePlayersTeamChange(byPlayer) {
    if (chooseMode && !removingPlayers && byPlayer == null) {
        if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
            deactivateChooseMode();
            resumeGame();
            var b = teamSpec.length;
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            } else {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            }
            return;
        } else if (
            (teamRed.length == teamSize && teamBlue.length == teamSize) ||
            (teamRed.length == teamBlue.length && teamSpec.length < 2)
        ) {
            deactivateChooseMode();
            resumeGame();
        } else if (teamRed.length <= teamBlue.length && redCaptainChoice != '') {
            if (redCaptainChoice == 'top') {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
            } else if (redCaptainChoice == 'random') {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
            } else {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
            }
            return;
        } else if (teamBlue.length < teamRed.length && blueCaptainChoice != '') {
            if (blueCaptainChoice == 'top') {
                room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
            } else if (blueCaptainChoice == 'random') {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.BLUE);
            } else {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
            }
            return;
        } else {
            choosePlayer();
        }
    }
}

function handlePlayersStop(byPlayer) {
    if (byPlayer == null && endGameVariable) {
        if (chooseMode) {
            if (players.length == 2 * teamSize) {
                chooseMode = false;
                resetButton();
                for (var i = 0; i < teamSize; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        randomButton();
                    }, 200 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 200 * teamSize);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else if (lastWinner == Team.BLUE) {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 10);
                } else {
                    resetButton();
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    topButton();
                }, 300);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 300);
            }
        } else {
            if (players.length == 2) {
                if (lastWinner == Team.BLUE) {
                    swapButton();
                }
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 3 || players.length >= 2 * teamSize + 1) {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 5);
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    topButton();
                }, 200);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 300);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 4) {
                resetButton();
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    randomButton();
                    setTimeout(() => {
                        randomButton();
                    }, 500);
                }, 500);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 2000);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 5 || players.length >= 2 * teamSize + 1) {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 5);
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 200);
                setTimeout(() => {
                    topButton();
                }, 200);
                activateChooseMode();
            } else if (players.length == 6) {
                resetButton();
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 1500);
                setTimeout(() => {
                    randomButton();
                    setTimeout(() => {
                        randomButton();
                        setTimeout(() => {
                            randomButton();
                        }, 500);
                    }, 500);
                }, 500);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            }
        }
    }
}

/* STATS FUNCTIONS */

/* GK FUNCTIONS */

function handleGKTeam(team) {
    if (team == Team.SPECTATORS) {
        return null;
    }
    let teamArray = team == Team.RED ? teamRed : teamBlue;
    let playerGK = teamArray.reduce((prev, current) => {
        if (team == Team.RED) {
            return (prev?.position.x < current.position.x) ? prev : current
        } else {
            return (prev?.position.x > current.position.x) ? prev : current
        }
    }, null);
    let playerCompGK = getPlayerComp(playerGK);
    return playerCompGK;
}

function handleGK() {
    let redGK = handleGKTeam(Team.RED);
    if (redGK != null) {
        redGK.GKTicks++;
    }
    let blueGK = handleGKTeam(Team.BLUE);
    if (blueGK != null) {
        blueGK.GKTicks++;
    }
}

function getGK(team) {
    if (team == Team.SPECTATORS) {
        return null;
    }
    let teamArray = team == Team.RED ? game.playerComp[0] : game.playerComp[1];
    let playerGK = teamArray.reduce((prev, current) => {
        return (prev?.GKTicks > current.GKTicks) ? prev : current
    }, null);
    return playerGK;
}

function getCS(scores) {
    let playersNameCS = [];
    let redGK = getGK(Team.RED);
    let blueGK = getGK(Team.BLUE);
    if (redGK != null && scores.blue == 0) {
        playersNameCS.push(redGK.player.name);
    }
    if (blueGK != null && scores.red == 0) {
        playersNameCS.push(blueGK.player.name);
    }
    return playersNameCS;
}

function getCSString(scores) {
    let playersCS = getCS(scores);
    if (playersCS.length == 0) {
        return "🥅 Maçı gol yemeden tamamlayan kaleci yok !";
    } else if (playersCS.length == 1) {
        return `🥅 ${playersCS[0]} maçı gol yemeden tamamladı !`;
    } else {
        return `🥅 ${playersCS[0]} ve ${playersCS[1]} maçı gol yemeden tamamladı !`;
    }
}

/* GLOBAL STATS FUNCTIONS */

function getLastTouchOfTheBall() {
    const ballPosition = room.getBallPosition();
    updateTeams();
    let playerArray = [];
    for (let player of players) {
        if (player.position != null) {
            var distanceToBall = pointDistance(player.position, ballPosition);
            if (distanceToBall < triggerDistance) {
                if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
                playerArray.push([player, distanceToBall]);
            }
        }
    }
    if (playerArray.length != 0) {
        let playerTouch = playerArray.sort((a, b) => a[1] - b[1])[0][0];
        if (lastTeamTouched == playerTouch.team || lastTeamTouched == Team.SPECTATORS) {
            if (lastTouches[0] == null || (lastTouches[0] != null && lastTouches[0].player.id != playerTouch.id)) {
                game.touchArray.push(
                    new BallTouch(
                        playerTouch,
                        game.scores.time,
                        getGoalGame(),
                        ballPosition
                    )
                );
                lastTouches[0] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 1,
                    getGoalGame()
                );
                lastTouches[1] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 2,
                    getGoalGame()
                );
            }
        }
        lastTeamTouched = playerTouch.team;
    }
}

function getBallSpeed() {
    var ballProp = room.getDiscProperties(0);
    return Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient;
}

function getGameStats() {
    if (playSituation == Situation.PLAY && gameState == State.PLAY) {
        lastTeamTouched == Team.RED ? possession[0]++ : possession[1]++;
        var ballPosition = room.getBallPosition();
        ballPosition.x < 0 ? actionZoneHalf[0]++ : actionZoneHalf[1]++;
        handleGK();
    }
}

/* GOAL ATTRIBUTION FUNCTIONS */

function getGoalAttribution(team) {
    var goalAttribution = Array(2).fill(null);
    if (lastTouches[0] != null) {
        if (lastTouches[0].player.team == team) {
            // Direct goal scored by player
            if (lastTouches[1] != null && lastTouches[1].player.team == team) {
                goalAttribution = [lastTouches[0].player, lastTouches[1].player];
            } else {
                goalAttribution = [lastTouches[0].player, null];
            }
        } else {
            // Own goal
            goalAttribution = [lastTouches[0].player, null];
        }
    }
    return goalAttribution;
}

function getGoalString(team) {
    var goalString;
    var scores = game.scores;
    var goalAttribution = getGoalAttribution(team);
    if (goalAttribution[0] != null) {
        if (goalAttribution[0].team == team) {
            if (goalAttribution[1] != null && goalAttribution[1].team == team) {
                goalString = `⚽𝗚𝗢𝗢𝗟𝗟𝗟 ♇${goalAttribution[0].name} (${goalAttribution[1].name})🧤🛡️ , ⌛${getTimeGame(scores.time)} 💨${ballSpeed.toFixed(2)} ᴋᴍ/s`;
                game.goals.push(
                    new Goal(
                        scores.time,
                        team,
                        goalAttribution[0],
                        goalAttribution[1]
                    )
                );
            } else {
                goalString = `⚽ 𝗚𝗢𝗢𝗟𝗟𝗟! ♇${goalAttribution[0].name}🧤🛡️ , ⌛${getTimeGame(scores.time)} 💨${ballSpeed.toFixed(2)} ᴋᴍ/s`;
                game.goals.push(
                    new Goal(scores.time, team, goalAttribution[0], null)
                );
            }
        } else {
            goalString = `😢𝗞𝗘𝗡𝗗𝗜 𝗞𝗔𝗟𝗘𝗦𝗜𝗡𝗘! ♇${goalAttribution[0].name}🧤🛡️ , ⌛${getTimeGame(scores.time)} 💨${ballSpeed.toFixed(2)} ᴋᴍ/s`;
            game.goals.push(
                new Goal(scores.time, team, goalAttribution[0], null)
            );
        }
    } else {
        goalString = `⚽ 𝗚𝗢𝗢𝗟𝗟𝗟! ⌛${getTimeGame(scores.time)} 💨${ballSpeed.toFixed(2)} ᴋᴍ/s`;
        game.goals.push(
            new Goal(scores.time, team, null, null)
        );
    }

    return goalString;
}

/* ROOM STATS FUNCTIONS */

function updatePlayerStats(player, teamStats) {
    var stats = new HaxStatistics(player.name);
    var pComp = getPlayerComp(player);
    if (LocalStatsStorage.getItem(player.name)) {
        stats = JSON.parse(LocalStatsStorage.getItem(player.name));
    }
    stats.games++;
    if (lastWinner == teamStats) stats.wins++;
    stats.winrate = ((100 * stats.wins) / (stats.games || 1)).toFixed(1) + `%`;
    stats.goals += getGoalsPlayer(pComp);
    stats.assists += getAssistsPlayer(pComp);
    stats.ownGoals += getOwnGoalsPlayer(pComp);
    stats.CS += getCSPlayer(pComp);
    stats.playtime += getGametimePlayer(pComp);
    LocalStatsStorage.setItem(player.name, JSON.stringify(stats));
}

function updateStats() {
    if (
        players.length >= 2 * teamSize &&
        (
            game.scores.time >= (5 / 6) * game.scores.timeLimit ||
            game.scores.red == game.scores.scoreLimit ||
            game.scores.blue == game.scores.scoreLimit
        ) &&
        teamRedStats.length >= teamSize && teamBlueStats.length >= teamSize
    ) {
        for (let player of teamRedStats) {
            updatePlayerStats(player, Team.RED);
        }
        for (let player of teamBlueStats) {
            updatePlayerStats(player, Team.BLUE);
        }
    }
}

function printRankings(statKey, id = 0) {
    var leaderboard = [];
    statKey = statKey == "cs" ? "CS" : statKey;
    
    // LocalStorage'den oyuncu verilerini almak
    for (var i = 0; i < LocalStatsStorage.length; i++) {
        var key = LocalStatsStorage.key(i);
        var playerData = JSON.parse(LocalStatsStorage.getItem(key));
        leaderboard.push([
            playerData.playerName,
            playerData[statKey]
        ]);
    }

    // Eğer yeterli oyuncu yoksa uyarı
    if (leaderboard.length < 5) {
        if (id != 0) {
            room.sendAnnouncement('⚠️ Odada yeterli sayıda oyun oynanmadı!', id, errorColor, 'bold', HaxNotification.CHAT);
        }
        return;
    }

    // Lider tablosunu sıralamak
    leaderboard.sort(function (a, b) { return b[1] - a[1]; });

    // Tablo başlıkları
    var rankingString = "";
    if (statKey === "games") {
        rankingString = "────────────────────────────── 𝗘𝗡 𝗖𝗢𝗞 𝗢𝗬𝗡𝗔𝗬𝗔𝗡𝗟𝗔𝗥: ──────────────────────────────\n";
    } else if (statKey === "wins") {
        rankingString = "────────────────────────────── 𝗘𝗡 𝗖𝗢𝗞 𝗞𝗔𝗭𝗔𝗡𝗔𝗡𝗟𝗔𝗥: ──────────────────────────────\n";
    } else if (statKey === "goals") {
        rankingString = "────────────────────────────── 𝗚𝗢𝗟 𝗞𝗥𝗔𝗟𝗟𝗜𝗚𝗜: ──────────────────────────────\n";
    } else if (statKey === "assists") {
        rankingString = "────────────────────────────── 𝗔𝗦𝗜𝗦𝗧 𝗞𝗥𝗔𝗟𝗟𝗜𝗚𝗜: ──────────────────────────────\n";
    } else if (statKey === "cs") {
        rankingString = "────────────────────────────── 𝗘𝗡 𝗜𝗬𝗜 𝗞𝗔𝗟𝗘𝗖𝗜𝗟𝗘𝗥: ──────────────────────────────\n";
    } else if (statKey === "playtime") {
        rankingString = "────────────────────────────── 𝗘𝗡 𝗔𝗞𝗧𝗜𝗙𝗟𝗘𝗥: ──────────────────────────────\n";
    }

    // İlk 5 oyuncuyu listeleme
    for (let i = 0; i < 5; i++) {
        let playerName = leaderboard[i][0];
        let playerStat = leaderboard[i][1];
        if (statKey === 'playtime') {
            playerStat = getTimeStats(playerStat); // Süreyi formatla
        }
        if (statKey === 'games') {
            rankingString += `${i + 1}-) ${playerName} (${playerStat} Oyun)\n`;
        } else if (statKey === 'playtime') {
            rankingString += `${i + 1}-) ${playerName} (${playerStat})\n`;
        } else if (statKey === 'wins') {
            rankingString += `${i + 1}-) ${playerName} (${playerStat} Kazanma)\n`;
        } else if (statKey === 'goals') {
            rankingString += `${i + 1}-) ${playerName} (${playerStat} Gol)\n`;
        } else if (statKey === 'assists') {
            rankingString += `${i + 1}-) ${playerName} (${playerStat} Asist)\n`;
        } else if (statKey === 'CS') {
            rankingString += `${i + 1}-) ${playerName} (${playerStat} Gol Yenmeyen Maç)\n`;
        }
        
    }
    rankingString += `────────────────────────────────────────────────────────────────────────────────`;
    // Sonuçları odada duyur
    room.sendAnnouncement(rankingString, id, 0x45b3cc,'small-bold', HaxNotification.CHAT);
}

/* GET STATS FUNCTIONS */

function getGamePlayerStats(player) {
    var stats = new HaxStatistics(player.name);
    var pComp = getPlayerComp(player);
    stats.goals += getGoalsPlayer(pComp);
    stats.assists += getAssistsPlayer(pComp);
    stats.ownGoals += getOwnGoalsPlayer(pComp);
    stats.playtime += getGametimePlayer(pComp);
    stats.CS += getCSPlayer(pComp);
    return stats;
}

function getGametimePlayer(pComp) {
    if (pComp == null) return 0;
    var timePlayer = 0;
    for (let j = 0; j < pComp.timeEntry.length; j++) {
        if (pComp.timeExit.length < j + 1) {
            timePlayer += game.scores.time - pComp.timeEntry[j];
        } else {
            timePlayer += pComp.timeExit[j] - pComp.timeEntry[j];
        }
    }
    return Math.floor(timePlayer);
}

function getGoalsPlayer(pComp) {
    if (pComp == null) return 0;
    var goalPlayer = 0;
    for (let goal of game.goals) {
        if (goal.striker != null && goal.team === pComp.player.team) {
            if (authArray[goal.striker.name][0] == pComp.auth) {
                goalPlayer++;
            }
        }
    }
    return goalPlayer;
}

function getOwnGoalsPlayer(pComp) {
    if (pComp == null) return 0;
    var goalPlayer = 0;
    for (let goal of game.goals) {
        if (goal.striker != null && goal.team !== pComp.player.team) {
            if (authArray[goal.striker.name][0] == pComp.auth) {
                goalPlayer++;
            }
        }
    }
    return goalPlayer;
}

function getAssistsPlayer(pComp) {
    if (pComp == null) return 0;
    var assistPlayer = 0;
    for (let goal of game.goals) {
        if (goal.assist != null) {
            if (authArray[goal.assist.name][0] == pComp.auth) {
                assistPlayer++;
            }
        }
    }
    return assistPlayer;
}

function getGKPlayer(pComp) {
    if (pComp == null) return 0;
    let GKRed = getGK(Team.RED);
    if (pComp.auth == GKRed?.auth) {
        return Team.RED;
    }
    let GKBlue = getGK(Team.BLUE);
    if (pComp.auth == GKBlue?.auth) {
        return Team.BLUE;
    }
    return Team.SPECTATORS;
}

function getCSPlayer(pComp) {
    if (pComp == null || game.scores == null) return 0;
    if (getGKPlayer(pComp) == Team.RED && game.scores.blue == 0) {
        return 1;
    } else if (getGKPlayer(pComp) == Team.BLUE && game.scores.red == 0) {
        return 1;
    }
    return 0;
}

function actionReportCountTeam(goals, team) {
    let playerActionSummaryTeam = [];
    let indexTeam = team == Team.RED ? 0 : 1;
    let indexOtherTeam = team == Team.RED ? 1 : 0;
    for (let goal of goals[indexTeam]) {
        if (goal[0] != null) {
            if (playerActionSummaryTeam.find(a => a[0].id == goal[0].id)) {
                let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[0].id);
                playerActionSummaryTeam[index][1]++;
            } else {
                playerActionSummaryTeam.push([goal[0], 1, 0, 0]);
            }
            if (goal[1] != null) {
                if (playerActionSummaryTeam.find(a => a[0].id == goal[1].id)) {
                    let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[1].id);
                    playerActionSummaryTeam[index][2]++;
                } else {
                    playerActionSummaryTeam.push([goal[1], 0, 1, 0]);
                }
            }
        }
    }
    if (goals[indexOtherTeam].length == 0) {
        let playerCS = getGK(team)?.player;
        if (playerCS != null) {
            if (playerActionSummaryTeam.find(a => a[0].id == playerCS.id)) {
                let index = playerActionSummaryTeam.findIndex(a => a[0].id == playerCS.id);
                playerActionSummaryTeam[index][3]++;
            } else {
                playerActionSummaryTeam.push([playerCS, 0, 0, 1]);
            }
        }
    }

    playerActionSummaryTeam.sort((a, b) => (a[1] + a[2] + a[3]) - (b[1] + b[2] + b[3]));
    return playerActionSummaryTeam;
}

/* FETCH FUNCTIONS */

function fetchActionsSummaryReport(game) {
    var fieldReportRed = {
        name: '🔴**KIRMIZI TAKIM**',
        value: ' ',
        inline: true,
    };
    var fieldReportBlue = {
        name: '🔵**MAVİ TAKIM**',
        value: ' ',
        inline: true,
    };
    var goals = [[], []];
    for (let i = 0; i < game.goals.length; i++) {
        goals[game.goals[i].team - 1].push([game.goals[i].striker, game.goals[i].assist]);
    }
    var redActions = actionReportCountTeam(goals, Team.RED);
    if (redActions.length > 0) {
        for (let act of redActions) {
            fieldReportRed.value += `> **${act[0].team != Team.RED ? '[KK] ' : ''}${act[0].name}:**` +
                `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
                `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
                `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
        }
    }
    var blueActions = actionReportCountTeam(goals, Team.BLUE);
    if (blueActions.length > 0) {
        for (let act of blueActions) {
            fieldReportBlue.value += `> **${act[0].team != Team.BLUE ? '[KK] ' : ''}${act[0].name}:**` +
                `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
                `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
                `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
        }
    }

    fieldReportRed.value += `\n${blueActions.length - redActions.length > 0 ? '\n'.repeat(blueActions.length - redActions.length) : ''
        }`;
    fieldReportRed.value += '=====================';

    fieldReportBlue.value += `\n${redActions.length - blueActions.length > 0 ? '\n'.repeat(redActions.length - blueActions.length) : ''
        }`;
    fieldReportBlue.value += '=====================';

    return [fieldReportRed, fieldReportBlue];
}

function fetchSummaryEmbed(game) {
    var fetchEndgame = [fetchActionsSummaryReport];
    var logChannel = gameWebhook;
    var fields = [
        {
            name: '🔴**KIRMIZI TAKIM**',
            value: '=====================\n\n',
            inline: true,
        },
        {
            name: '🔵**MAVİ TAKIM**',
            value: '=====================\n\n',
            inline: true,
        },
    ];
    for (let i = 0; i < fetchEndgame.length; i++) {
        var fieldsReport = fetchEndgame[i](game);
        fields[0].value += fieldsReport[0].value + '\n\n';
        fields[1].value += fieldsReport[1].value + '\n\n';
    }
    fields[0].value = fields[0].value.substring(0, fields[0].value.length - 2);
    fields[1].value = fields[1].value.substring(0, fields[1].value.length - 2);

    var possR = possession[0] / (possession[0] + possession[1]);
    var possB = 1 - possR;
    var possRString = (possR * 100).toFixed(0).toString();
    var possBString = (possB * 100).toFixed(0).toString();
    var zoneR = actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1]);
    var zoneB = 1 - zoneR;
    var zoneRString = (zoneR * 100).toFixed(0).toString();
    var zoneBString = (zoneB * 100).toFixed(0).toString();
    var win = (game.scores.red > game.scores.blue) * 1 + (game.scores.blue > game.scores.red) * 2;
    var totalPasses = Math.floor(Math.random() * 11) + 25;
    var passesRed = Math.round(totalPasses * possR);
    var passesBlue = totalPasses - passesRed;
    var objectBodyWebhook = {
        embeds: [
            {
                title: `**MAÇ KAYDI (${getIdReport()})**`,
                description: 
                `**SÜRE:** ${getTimeEmbed(game.scores.time)} \n**SKOR:** [${game.scores.red} - ${game.scores.blue}]
                \`\`\`c
Topa Sahip Olma: ${possRString}% - ${possBString}%
Isı Haritası: ${zoneRString}% - ${zoneBString}%
Pas Haritası: ${passesRed} - ${passesBlue}
${win == 1 ? '🟥 ᴋıʀᴍıᴢı ᴛᴀᴋıᴍ ᴋᴀᴢᴀɴᴅı' : '🟦 ᴍᴀᴠɪ ᴛᴀᴋıᴍ ᴋᴀᴢᴀɴᴅı'}\`\`\`
                `,                
            color: 9567999,
                fields: fields,
                footer: {
                    text: ` Haxball Oyun Kayıt Sistemi`,
                },
                timestamp: new Date().toISOString(),
            },
        ],
        username: " Bot"
    };
    if (logChannel != '') {
        fetch(logChannel, {
            method: 'POST',
            body: JSON.stringify(objectBodyWebhook),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
}

/* EVENTS */

/* PLAYER MOVEMENT */

room.onPlayerJoin = function (player) {
    authArray[player.name] = [player.auth, player.conn];
    if (isAdmin(player) || isMaster(player)) {
        afkCommand(player,"!afk")
    }
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `**🟩 ${player.name} odaya bağlandı.**`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
    const isBanned = banList.some((bannedPlayer) => bannedPlayer[0] === player.name);
    if (isBanned) {
        // Eğer oyuncu banlanmışsa, odaya girmesini engelle
        room.kickPlayer(player.id, "Odadan banlanmışsınız. Kaldırmak için Discord'a gelip destek talebi oluşturmalısınız: " + discordLink, true);
    }
    room.sendAnnouncement(
        `💬 𝗛𝗢𝗦 𝗚𝗘𝗟𝗗𝗜𝗡 ${player.name}, 🔷!ᴋᴏᴍᴜᴛʟᴀʀ 🔷!ᴀᴅᴍɪɴᴄᴀɢɪʀ 👥𝗗𝗜𝗦𝗖𝗢𝗥𝗗 : ${discordLink}`,
        null,
        welcomeColor,
        'normal',
        1
    );
    updateTeams();
    updateAdmins();
    if (masterList.findIndex((auth) => auth == player.auth) != -1) {
        room.sendAnnouncement(
            `⚜️ 𝓨𝓞𝓝𝓔𝓣𝓘𝓒𝓘 ⚜️ ᴏᴅᴀʏᴀ ʙᴀɢʟᴀɴᴅı.`,
            null,
            yöneticiColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(player.id, true);
    } else if (adminList.map((a) => a[0]).findIndex((auth) => auth == player.auth) != -1) {
        room.sendAnnouncement(
            `🔰 𝓜𝓞𝓓𝓔𝓡𝓐𝓣𝓞𝓡 🔰 ᴏᴅᴀʏᴀ ʙᴀɢʟᴀɴᴅı.`,
            null,
            moderatorColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(player.id, true);
    }
    var sameAuthCheck = playersAll.filter((p) => p.id != player.id && authArray[p.name][0] == player.auth);
    if (sameAuthCheck.length > 0 && !debugMode) {
        var oldPlayerArray = playersAll.filter((p) => p.id != player.id && authArray[p.name][0] == player.auth);
        for (let oldPlayer of oldPlayerArray) {
            ghostKickHandle(oldPlayer, player);
        }
    }
    handlePlayersJoin();
    onJoinProfile(player);
};

room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
    handleLineupChangeTeamChange(changedPlayer);
    if (AFKSet.has(changedPlayer.id) && changedPlayer.team != Team.SPECTATORS) {
        room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
        room.sendAnnouncement(
            `⚠️ ${changedPlayer.name} isimli oyuncu AFK olduğu için takımını değiştiremezsin !`,
            null,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return;
    }
    updateTeams();
    if (gameState != State.STOP) {
        if (changedPlayer.team != Team.SPECTATORS && game.scores.time <= (3 / 4) * game.scores.timeLimit && Math.abs(game.scores.blue - game.scores.red) < 2) {
            changedPlayer.team == Team.RED ? teamRedStats.push(changedPlayer) : teamBlueStats.push(changedPlayer);
        }
    }
    handleActivityPlayerTeamChange(changedPlayer);
    handlePlayersTeamChange(byPlayer);
};

room.onPlayerLeave = function (player) {
    let playerData = LocalProfilesStorage.getItem(player.name);
    if (playerData) {
        playerData = JSON.parse(playerData);  // JSON string'i objeye çevir
        if (playerData.loggedIn) {
            playerData.loggedIn = false;  // Giriş durumu false olarak güncelleniyor
            LocalProfilesStorage.setItem(player.name, JSON.stringify(playerData));  // Güncellenmiş veriyi JSON string olarak kaydediyoruz
        }
    }
    setTimeout(() => {
        if (roomWebhook != '') {
            var stringContent = `**🟥 ${player.name} odadan ayrıldı.**`;
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: stringContent,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
        }
    }, 10);
    handleLineupChangeLeave(player);
    checkCaptainLeave(player);
    updateTeams();
    updateAdmins();
    handlePlayersLeave();
};

room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
    kickFetchVariable = true;
    if (ban && byPlayer) {
        // Ban işlemi için webhook gönderimi
        if (banWebhook != '') {
            fetch(banWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Ban İşlemi",
                    embeds: [{
                        title: "BAN İŞLEMİ",
                        description: `\`${kickedPlayer.name}\` adlı oyuncu banlandı.`,
                        color: 15158332, // Embed rengi (Kırmızı, ban için)
                        fields: [
                            {
                                name: "**Banlanan Oyuncu**",
                                value: `#${kickedPlayer.id} ${kickedPlayer.name}`,
                                inline: true
                            },
                            {
                                name: "**Banlayan Yetkili**",
                                value: `#${byPlayer.id} ${byPlayer.name}`,
                                inline: true
                            },
                            {
                                name: "**Sebep**",
                                value: reason || "Sebep belirtilmemiş",
                                inline: false
                            }
                        ],
                        timestamp: new Date(),
                    }]
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => res)
            .catch((err) => {
                console.error('Webhook gönderilirken bir hata oluştu:', err);
            });
        }
    } else if (ban) {
        if (banWebhook != '') {
            fetch(banWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Ban İşlemi",
                    embeds: [{
                        title: "BAN İŞLEMİ",
                        description: `\`${kickedPlayer.name}\` adlı oyuncu banlandı.`,
                        color: 15158332, // Embed rengi (Kırmızı, ban için)
                        fields: [
                            {
                                name: "**Banlanan Oyuncu**",
                                value: `#${kickedPlayer.id} ${kickedPlayer.name}`,
                                inline: true
                            },
                            {
                                name: "**Banlayan Yetkili**",
                                value: `SİSTEM TARAFINDAN BANLANDI`,
                                inline: true
                            },
                            {
                                name: "**Sebep**",
                                value: reason || "Sebep belirtilmemiş",
                                inline: false
                            }
                        ],
                        timestamp: new Date(),
                    }]
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => res)
            .catch((err) => {
                console.error('Webhook gönderilirken bir hata oluştu:', err);
            });
        }
    }
    if ((ban && ((byPlayer != null &&
        (byPlayer.id == kickedPlayer.id || getRole(byPlayer) < Role.MASTER)) || getRole(kickedPlayer) == Role.MASTER)) || disableBans
    ) {
        room.clearBan(kickedPlayer.id);
        return;
    }
    if (byPlayer != null && getRole(byPlayer) < Role.ADMIN_PERM) {
        room.sendAnnouncement(
            '⚠️ Kick / Ban yetkin yok !',
            byPlayer.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(byPlayer.id, false);
        return;
    }
    if (ban) banList.push([kickedPlayer.name, kickedPlayer.id]);
    listeleriGüncelle()
};

/* PLAYER ACTIVITY */

room.onPlayerChat = function (player, message) {
    if (gameState !== State.STOP && player.team != Team.SPECTATORS) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
    let msgArray = message.split(/ +/);
    if (!message.startsWith("!")) {
        if (roomWebhook != '')
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `**${player.name}** : ${message.replace('@', '@ ')}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
    }
    if (msgArray[0][0] == '!') {
        let command = getCommand(msgArray[0].slice(1).toLowerCase());
        if (command != false && commands[command].roles <= getRole(player)) commands[command].function(player, message);
        else
            room.sendAnnouncement(
                `⚠️ Girdiğin komut geçersiz. Kullanılabilir komutları görmek için '!komutlar' kullan.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        return false;
    }
    if (msgArray[0].toLowerCase() == 't') {
        teamChat(player, message);
        return false;
    }
    if (chooseMode && teamRed.length * teamBlue.length != 0) {
        var choosingMessageCheck = chooseModeFunction(player, message);
        if (choosingMessageCheck) return false;
    }
    if (slowMode > 0) {
        var filter = slowModeFunction(player, message);
        if (filter && !isSpecial) {
            room.sendAnnouncement(
                `${player.name}: ${message} (Bu mesajı sadece siz görebilirsiniz)`,
                player.id,
                0xffffff,
                'normal',
                HaxNotification.CHAT
            );
            room.sendAnnouncement(
                `💬 Yavaşlatılmış chat modu devrede.`,
                player.id,
                welcomeColor,
                'bold',
                HaxNotification.CHAT
            );
            return false;
        }
    }
    if (!player.admin && muteArray.getByAuth(authArray[player.name][0]) != null) {
        room.sendAnnouncement(
            `⚠️ Susturulmuşsun !`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false;
    }
    if (masterList.findIndex((auth) => auth == authArray[player.name][0]) != -1) {
        room.sendAnnouncement(
            `⚜️ ${player.name}: ${message}`,
            null,
            yöneticiColor,
            'bold',
            HaxNotification.CHAT
        );
        return false
    } else if (adminList.map((a) => a[0]).findIndex((auth) => auth == authArray[player.name][0]) != -1) {
        room.sendAnnouncement(
            `🔰 ${player.name}: ${message}`,
            null,
            moderatorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false
    } else {
        room.sendAnnouncement(
            `[${rutbeCommand(player)}] ${player.name}: ${message}`,
            null,
            0xffffff,
            'normal',
            HaxNotification.CHAT
        );
        return false
    }
};

room.onPlayerActivity = function (player) {
    if (gameState !== State.STOP) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
};

room.onPlayerBallKick = function (player) {
    let team = player.team
    if (team === 1) {
        room.setDiscProperties(0,{colors: redColor})
    } else if (team === 2) {
        room.setDiscProperties(0,{colors: blueColor})
    }
    if (playSituation != Situation.GOAL) {
        var ballPosition = room.getBallPosition();
        if (game.touchArray.length == 0 || player.id != game.touchArray[game.touchArray.length - 1].player.id) {
            if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
            lastTeamTouched = player.team;
            game.touchArray.push(
                new BallTouch(
                    player,
                    game.scores.time,
                    getGoalGame(),
                    ballPosition
                )
            );
            lastTouches[0] = checkGoalKickTouch(
                game.touchArray,
                game.touchArray.length - 1,
                getGoalGame()
            );
            lastTouches[1] = checkGoalKickTouch(
                game.touchArray,
                game.touchArray.length - 2,
                getGoalGame()
            );
        }
    }
};

/* GAME MANAGEMENT */

room.onGameStart = function (byPlayer) {
    clearTimeout(startTimeout);
    if (byPlayer != null) clearTimeout(stopTimeout);
    game = new Game();
    possession = [0, 0];
    actionZoneHalf = [0, 0];
    gameState = State.PLAY;
    endGameVariable = false;
    goldenGoal = false;
    playSituation = Situation.KICKOFF;
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    teamRedStats = [];
    teamBlueStats = [];
    if (teamRed.length == teamSize && teamBlue.length == teamSize) {
        for (var i = 0; i < teamSize; i++) {
            teamRedStats.push(teamRed[i]);
            teamBlueStats.push(teamBlue[i]);
        }
    }
    calculateStadiumVariables();
};

room.onGameStop = function (byPlayer) {
    clearTimeout(stopTimeout);
    clearTimeout(unpauseTimeout);
    if (byPlayer != null) clearTimeout(startTimeout);
    game.rec = room.stopRecording();
    if (
        !cancelGameVariable && game.playerComp[0].length + game.playerComp[1].length > 0 &&
        (
            (game.scores.timeLimit != 0 &&
                ((game.scores.time >= 0.5 * game.scores.timeLimit &&
                    game.scores.time < 0.75 * game.scores.timeLimit &&
                    game.scores.red != game.scores.blue) ||
                    game.scores.time >= 0.75 * game.scores.timeLimit)
            ) ||
            endGameVariable
        )
    ) {
        fetchSummaryEmbed(game);
        if (fetchRecordingVariable) {
            setTimeout((gameEnd) => { fetchRecording(gameEnd); }, 500, game);
            room.sendAnnouncement(`🎬 Maç Kaydı Discord'a gönderildi. Kayıt Numarası: ${getIdReport()}`,null,0xffffff,"bold",2)
        }
    }
    cancelGameVariable = false;
    gameState = State.STOP;
    playSituation = Situation.STOP;
    updateTeams();
    handlePlayersStop(byPlayer);
    handleActivityStop();
};

room.onGamePause = function (byPlayer) {
    if (mentionPlayersUnpause && gameState == State.PAUSE) {
        if (byPlayer != null) {
            room.sendAnnouncement(
                `Oyun durduruldu (${byPlayer.name})`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        } else {
            room.sendAnnouncement(
                `Oyun durduruldu`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        }
    }
    clearTimeout(unpauseTimeout);
    gameState = State.PAUSE;
};

room.onGameUnpause = function (byPlayer) {
    unpauseTimeout = setTimeout(() => {
        gameState = State.PLAY;
    }, 2000);
    if (mentionPlayersUnpause) {
        if (byPlayer != null) {
            room.sendAnnouncement(
                `Oyun devam ettirildi (${byPlayer.name})`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        } else {
            room.sendAnnouncement(
                `Oyun devam ettirildi`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        }
    }
    if (
        (teamRed.length == teamSize && teamBlue.length == teamSize && chooseMode) ||
        (teamRed.length == teamBlue.length && teamSpec.length < 2 && chooseMode)
    ) {
        deactivateChooseMode();
    }
};

room.onTeamGoal = function (team) {
    const scores = room.getScores();
    game.scores = scores;
    playSituation = Situation.GOAL;
    ballSpeed = getBallSpeed();
    var goalString = getGoalString(team);
    for (let player of teamRed) {
        var playerComp = getPlayerComp(player);
        team == Team.RED ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
    }
    for (let player of teamBlue) {
        var playerComp = getPlayerComp(player);
        team == Team.BLUE ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
    }
    room.sendAnnouncement(
        goalString,
        null,
        0xffffff,
        "normal",
        HaxNotification.CHAT
    );
    if ((scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit)) || goldenGoal) {
        endGame(team);
        goldenGoal = false;
        stopTimeout = setTimeout(() => {
            room.stopGame();
        }, 1000);
    }
};

room.onPositionsReset = function () {
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    playSituation = Situation.KICKOFF;
};

/* MISCELLANEOUS */


let currentAnnouncementIndex = 0;
 
 


function dcLinkGönder(player) {
    room.sendAnnouncement(`                                       ▒█▀▀▄ ▀█▀ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▄`,player.id,0x5e85fe,"bold",0);
    room.sendAnnouncement(`                                       ▒█░▒█ ▒█░ ░▀▀▀▄▄ ▒█░░░ ▒█░░▒█ ▒█▄▄▀ ▒█░▒█`,player.id,0x7e76ff,"bold",0);
    room.sendAnnouncement(`                                       ▒█▄▄▀ ▄█▄ ▒█▄▄▄█ ▒█▄▄█ ▒█▄▄▄█ ▒█░▒█ ▒█▄▄▀`,player.id,0x9f66fe,"bold",0);
    room.sendAnnouncement(`                                      🟣 ᑎOᐯᗩ Ailesine Katıl ➡ ${discordLink}⬅`,player.id,0x9f66fe,"bold",2);
}

function sendAnnouncements() {
    if (announcementList.length === 0) {
        console.error("Duyuru listesi boş! Lütfen duyuru ekleyin.");
        return;
    }
    const duyuruString = announcementList[currentAnnouncementIndex];

    room.sendAnnouncement(
        `📢 ${duyuruString}`,
        null,
        0xcbfe65,
        "bold",
        2
    );

    currentAnnouncementIndex = (currentAnnouncementIndex + 1) % announcementList.length; 
}

room.onRoomLink = function (url) {
    room.setTeamColors(1, 45, 0xD0D0D0, [0x6A0000, 0x780000, 0x820000])
    room.setTeamColors(2, 45, 0xAEAEAE, [0x010053, 0x01005F, 0x010068])
    setInterval(sendAnnouncements, 3 * 60 * 1000); // 3 dakikada bir duyuru yapacak
    console.log(`${url}\nYönetici Şifresi : ${masterPassword}`);
    listeleriYükleYadaOluştur()
    setInterval(listeleriYükle, 5 * 1000);
    roomLink = url
};

room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
    updateTeams();
    if (!changedPlayer.admin && getRole(changedPlayer) >= Role.ADMIN_TEMP) {
        room.setPlayerAdmin(changedPlayer.id, true);
        return;
    }
    updateAdmins(byPlayer != null && !changedPlayer.admin && changedPlayer.id == byPlayer.id ? changedPlayer.id : 0);
};



room.onStadiumChange = function (newStadiumName, byPlayer) {
    if (byPlayer !== null) {
        if (getRole(byPlayer) < Role.MASTER && currentStadium != 'diğermap') {
            room.sendAnnouncement(
                `⚠️ Stadyumu manuel olarak değiştiremezsin.`,
                byPlayer.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            stadiumCommand(emptyPlayer, `!${currentStadium}`);
        } else {
            room.sendAnnouncement(
                `📢 Stadyum değiştirildi.`,
                byPlayer.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            currentStadium = 'diğermap';
        }
    }
    checkStadiumVariable = true;
};

room.onGameTick = function () {
    checkTime();
    getLastTouchOfTheBall();
    getGameStats();
    handleActivity();
    
};


});


/*████████████████████████ BOT KOMUTLARI ████████████████████████*/
client.once('ready', () => {
    console.log('Bot hazır!');
    client.application.commands.set([
        new SlashCommandBuilder()
            .setName('mesajgönder')
            .setDescription('Belirtilen odaya mesaj gönderir.')
            .addStringOption(option =>
                option.setName('mesaj')
                    .setDescription('Göndermek istediğiniz mesajı yazın')
                    .setRequired(true)
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('oyuncular')
            .setDescription('Haxball odasındaki oyuncuları listeler')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('oyuncuyuat')
            .setDescription('Haxball odasından oyuncuyu atar.')
            .addIntegerOption(option =>
                option
                    .setName('id')
                    .setDescription('Oyuncunun ID`si bilmiyorsa /oyuncular ile bakabilirsin.')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('ban')
                    .setDescription('`evet` yazarsan banlanır `hayır` yazarsan banlanmaz')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('sebep')
                    .setDescription('BAN/KICK sebebi girilmeli.')
                    .setRequired(true)
            )
            .toJSON(),        
        new SlashCommandBuilder()
            .setName('odalinki')
            .setDescription('Belirtilen odanın linkini alır')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('odanickim')
            .setDescription('Haxball nicki ve şifresi ile Discord hesabını eşleştirir.')
            .addStringOption(option =>
                option.setName('nick')
                    .setDescription('Haxball nickinizi girin.')
                    .setRequired(true)
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('temizle')
            .setDescription('Belirtilen sayı kadar mesaj temizler')
            .addStringOption(option =>
                option.setName('sayı')
                    .setDescription('Silinecek mesaj sayısını girin.')
                    .setRequired(true)
            ).toJSON(),
        new SlashCommandBuilder()
            .setName('odanickimne')
            .setDescription('Haxball oda nickinizi gösterir.').toJSON(),
        new SlashCommandBuilder()
            .setName('rank')
            .setDescription('Haxball oda rankınızı gösterir.').toJSON(),
       
            
    ]);


});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        const nick = interaction.options.getString('nick');
        const discordId = interaction.user.id;
    
        // interaction.member.roles.cache.has(ADMIN_ROLE_ID)
    
        if (commandName === 'mesajgönder') {
            if (interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
                const mesaj = interaction.options.getString('mesaj');

                let room = client.room
                room.sendAnnouncement(mesaj, null, 0xcbfe65, "bold", 2);
                await interaction.reply(`\`\`\`${roomName} isimli odaya mesaj gönderildi: ${mesaj}\`\`\``);
            } else {
                await interaction.reply({
                    content: 'Yetkiniz yok! Bu komutu sadece adminler kullanabilir.',
                    ephemeral: true,
                });
            }
        }else if (commandName === 'odalinki') {
            if (interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
                const url = roomLink; // Oda linki değişkeni
        
                // Embed oluşturuluyor
                const embed = new EmbedBuilder()
                    .setColor(0x3498db) // Renk ayarı
                    .setTitle('Oda Linki') // Embed başlığı
                    .setDescription(`${roomName}`) // Açıklama
                    .addFields(
                        { name: '🔗 Oda Linki', value: `[Odaya Bağlan](${url})`, inline: false }
                    )
                    .setFooter({ text: ' Haxball Odaları' })
                    .setTimestamp(); // Mesajın zamanı eklenir
        
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({
                    content: 'Yetkiniz yok! Bu komutu sadece adminler kullanabilir.',
                    ephemeral: true,
                });
            }
        }
         else if (commandName === 'odanickim') {
            // LocalProfilesStorage'den nick ile ilgili veriyi alıyoruz
            const playerDataNick = LocalProfilesStorage.getItem(nick);
            playerData = JSON.parse(playerDataNick);
    
            if (!playerData) {
                // Eğer nick bulunamazsa, kullanıcıya kayıt olmalarını hatırlatıyoruz
                await interaction.reply('Bu nick ile kayıtlı bir hesap bulunamadı. Lütfen haxball odalarımızda kayıt olun.');
                return;
            }
    
            // Eğer oyuncu kaydolmuşsa, şifresini kontrol ediyoruz
            if (playerData.registered == true) {
                    // Şifre doğru ise, Discord ID ve nick'i LocalDiscordProfilesStorage'a kaydediyoruz
    
                    // Zaten Discord ID ile profil var mı kontrol et
                    const discordProfile = LocalDiscordProfilesStorage.getItem(discordId);
                    if (discordProfile) {
                        await interaction.reply('Oda nickini zaten seçmişsin.');
                        return;
                    }
    
                    // Zaten nick ile profil var mı kontrol et
                    const existingNickProfile = LocalDiscordProfilesStorage.getItem(nick);
                    if (existingNickProfile) {
                        await interaction.reply('Bu nick zaten bir Discord profili ile eşleştirilmiş.');
                        return;
                    }
    
                    // Eşleşme başarılı, profili kaydediyoruz
                    const profile = { nick: nick, discordId: discordId };
    
                    // Nesneyi JSON string'e dönüştürerek kaydet
                    LocalDiscordProfilesStorage.setItem(discordId, JSON.stringify(profile));
                    await interaction.reply(`\`\`\`Haxball ve Discord hesabınız eşleştirildi. Haxball Nickiniz: ${nick}\`\`\``);
            } else {
                // Eğer oyuncu kaydedilmemişse
                await interaction.reply('```Bu hesap kaydedilmemiş. Lütfen önce kayıt olun.```');
            }
        } else if (commandName === 'temizle') {
            // Sadece admin ya da uygun yetkili rolü kontrol edin
            if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
                await interaction.reply({
                    content: '```Mesajları silme yetkiniz yok!```',
                    ephemeral: true,
                });
                return;
            }
    
            // 'sayı' parametresini alıyoruz
            const numberOfMessages = interaction.options.getString('sayı');
    
            // Parametreyi integer'a çeviriyoruz
            const amount = parseInt(numberOfMessages, 10);
    
            if (isNaN(amount) || amount <= 0 || amount > 100) {
                await interaction.reply({
                    content: '```Lütfen 1 ile 100 arasında geçerli bir sayı girin.```',
                    ephemeral: true,
                });
                return;
            }
    
            // Mesajları temizleme işlemi
            try {
                const messages = await interaction.channel.messages.fetch({ limit: amount });
                await interaction.channel.bulkDelete(messages, true);
                await interaction.reply({
                    content: `\`\`\`${amount} adet mesaj başarıyla silindi.\`\`\``,
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '```Mesajları silerken bir hata oluştu.```',
                    ephemeral: true,
                });
            }
        } else if (commandName === 'rank') {
            const discordId = interaction.user.id; // Kullanıcının Discord ID'si
            const discordProfile = LocalDiscordProfilesStorage.getItem(discordId);
        
            // Kullanıcı eşleştirilmiş mi kontrol et
            if (!discordProfile) {
                await interaction.reply({
                    content: 'Haxball hesabınız Discord ile eşleştirilmemiş. Lütfen önce /odanickim komutunu kullanarak hesabınızı bağlayın.',
                    ephemeral: true,
                });
                return;
            }
        
            const { nick } = JSON.parse(discordProfile); // Eşleştirilmiş Haxball nick'i
        
            // Oyuncunun istatistiklerini al
            const playerStatsData = LocalStatsStorage.getItem(nick);
            if (!playerStatsData) {
                await interaction.reply({
                    content: `Oyuncu "${nick}" için kayıtlı istatistik bulunamadı.`,
                    ephemeral: true,
                });
                return;
            }
        
            const stats = JSON.parse(playerStatsData);
        
            // İstatistikleri hesapla
            const losses = stats.games - stats.wins;
            const points = (stats.wins * 15) + (losses * -10) + (stats.goals * 5) + (stats.assists * 3) + (stats.ownGoals * -3) + (stats.CS * 5);
            const winrate = ((stats.wins / stats.games) * 100).toFixed(2);
        
            // Rütbe hesaplama
            let rankTitle;
            if (points <= 500) {
                rankTitle = 'ᴀɢɪʀ ᴀᴄᴇᴍɪ';
            } else if (points <= 1000) {
                rankTitle = 'ᴀᴄᴇᴍɪ';
            } else if (points <= 2000) {
                rankTitle = 'ᴏʀᴛᴀ';
            } else if (points <= 5000) {
                rankTitle = 'ᴘʀᴏ';
            } else if (points <= 10000000) {
                rankTitle = 'ʜᴘ';
            } else {
                rankTitle = 'ʀᴜᴛʙᴇꜱɪᴢ';
            }
        
            // Embed oluştur
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`📊 ${nick} İstatistikleri`)
                .setThumbnail('https://www.saganetwork.net/en/assets/images/game-pricing/haxball/haxball.webp')
                .setDescription(`${nick} isimli oyuncunun performansını bir bakışta keşfedin!`)
                .addFields(
                    { 
                        name: 'İstatistikler', 
                        value: `\`\`\`
𝗚𝗘𝗡𝗘𝗟
Maç: ${stats.games}
Galibiyet: ${stats.wins}
Mağlubiyet: ${losses}
Kazanma Oranı: %${winrate}
    
𝗣𝗘𝗥𝗙𝗢𝗥𝗠𝗔𝗡𝗦
Gol: ${stats.goals}
Asist: ${stats.assists}
CS: ${stats.CS}
Kendi Kalesine: ${stats.ownGoals}
        \`\`\`` 
                    },
                    { 
                        name: 'Puan ve Rütbe', 
                        value: `\`\`\`css
Puan: ${points}     
    
Rütbe: ${rankTitle}
        \`\`\``
                    }
                )
                .setFooter({ text: ' Rank Sistemi' });
        
            await interaction.reply({ embeds: [embed] });
        } else if (commandName === 'odanickimne') {
            const discordId = interaction.user.id; // Kullanıcının Discord ID'si
        
            // Kullanıcının Discord ID'sine göre kaydedilen Haxball profili bilgilerini al
            const discordProfile = LocalDiscordProfilesStorage.getItem(discordId);
        
            // Eğer profil bulunamazsa, kullanıcıya hata mesajı gönder
            if (!discordProfile) {
                await interaction.reply({
                    content: '```Haxball hesabınız Discord ile eşleştirilmemiş. Lütfen önce Haxball nick\'inizi /odanickim ile kaydedin.```',
                    ephemeral: true,
                });
                return;
            }
        
            // Kaydedilen nick'i JSON formatında parse et
            const { nick } = JSON.parse(discordProfile);
        
            // Kaydedilen nick'i kullanıcıya göster
            await interaction.reply({
                content: `\`\`\`Odalarda kayıtlı nick\'iniz: ${nick}\`\`\``,
            });
        } else if (commandName === 'oyuncular') {
            if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
                await interaction.reply({
                    content: 'Sadece adminler kullanabilir.',
                    ephemeral: true,
                });
                return false
            }
            if (interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
            try {
                let room = client.room
                if (!room) {
                    await interaction.reply({
                        content: `Oda bulunamadı.`,
                        ephemeral: true,
                    });
                    return;
                }
        
                const players = room.getPlayerList(); // Oda oyuncularının listesi
        
                if (players.length === 0) {
                    await interaction.reply({
                        content: `Oda şu anda boş.`,
                        ephemeral: true,
                    });
                    return;
                }
        
                // Oyuncuları takımlarına göre ayırıyoruz
                const redTeam = players.filter(player => player.team === 1);
                const blueTeam = players.filter(player => player.team === 2);
                const spectators = players.filter(player => player.team === 0);
        
                // Oyuncu listesini hazırlıyoruz
                const formatPlayer = player => 
                    `[#${player.id}] ${player.name}${player.admin ? ' (Moderatör)' : ''}`;
        
                const redList = redTeam.map(formatPlayer).join('\n') || '🔴 Kırmızı takımda oyuncu yok.';
                const blueList = blueTeam.map(formatPlayer).join('\n') || '🔵 Mavi takımda oyuncu yok.';
                const spectatorList = spectators.map(formatPlayer).join('\n') || '👀 İzleyici yok.';
        
                // Mesaj için embed oluşturuluyor
                const embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle(`Odadaki Oyuncuların Listesi`)
                    .setDescription(`Haxball odasındaki oyuncular aşağıda listelenmiştir.`)
                    .addFields(
                        { name: '🔴 Kırmızı Takım', value: `\`\`\`\n${redList}\n\`\`\`` },
                        { name: '👀 İzleyiciler', value: `\`\`\`\n${spectatorList}\n\`\`\`` },
                        { name: '🔵 Mavi Takım', value: `\`\`\`\n${blueList}\n\`\`\`` }
                    )
                    .setFooter({ text: ' Haxball Odaları' });
        
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Hata oluştu:', error);
                await interaction.reply({
                    content: 'Oyuncu listesi alınırken bir hata oluştu.',
                    ephemeral: true,
                });
            }
            }
            
        } else if (commandName === 'oyuncuyuat') {
            if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
                await interaction.reply({
                    content: 'Sadece adminler kullanabilir.',
                    ephemeral: true,
                });
                return false
            }
            const playerId = interaction.options.getInteger('id');
            const reason = interaction.options.getString('sebep'); // Sebep
            const banOption = interaction.options.getString('ban'); // Ban seçeneği

                
            // Ban parametresinin geçerli olup olmadığını kontrol et
            const ban = banOption.toLowerCase() === 'evet' ? true : banOption.toLowerCase() === 'hayır' ? false : null;
        
            if (ban === null) {
                await interaction.reply({
                    content: '`ban` parametresi sadece `evet` veya `hayır` olabilir.',
                    ephemeral: true,
                });
                return;
            }
        
            try {
                const room = client.room
        
                if (!room) {
                    await interaction.reply({
                        content: `Oda bulunamadı.`,
                        ephemeral: true,
                    });
                    return;
                }
        
                // Oyuncunun atılması
                const player = room.getPlayer(playerId);
                if (!player) {
                    await interaction.reply({
                        content: `ID'si ${playerId} olan oyuncu bulunamadı.`,
                        ephemeral: true,
                    });
                    return;
                }
        
                // Oyuncuyu odadan atma işlemi
                room.kickPlayer(playerId, reason, ban);
        
                await interaction.reply({
                    content: `Oyuncu [${playerId}] ${player.name} ${ban ? 'banlandı' : 'odadan atıldı'}.\nSebep: ${reason}`,
                });
            } catch (error) {
                console.error('Hata oluştu:', error);
                await interaction.reply({
                    content: 'Oyuncuyu atarken bir hata oluştu.',
                    ephemeral: true,
                });
            }
        }

    } 
    
    

});


client.login(DİSCORD_BOT_TOKEN);
