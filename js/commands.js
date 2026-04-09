const SIEGE_VERSION = '1.0.1 LTS';

// Virtual filesystem state
const FileSystem = {
    currentPath: '~',

    directories: {
        '~': {
            items: [
                '<span style="color: #4e94ce;">projects/</span>',
                '<span style="color: #4e94ce;">documents/</span>',
                '<span style="color: #4e94ce;">images/</span>',
                '<span style="color: #42a647;">README.md</span>',
                '<span style="color: #42a647;">profile.txt</span>',
                '<span style="color: #42a647;">contact.info</span>',
                '<span style="color: #42a647;">resume.pdf</span>'
            ],
            subdirs: ['projects', 'documents', 'images']
        },
        '~/projects': {
            items: [
                '<span style="color: #58a6ff;">beats.rc6.org.link</span>',
                '<span style="color: #58a6ff;">n2g.dev.link</span>',
                '<span style="color: #58a6ff;">nilicule.com.link</span>',
                '<span style="color: #58a6ff;">rc6.org.link</span>'
            ],
            subdirs: []
        },
        '~/documents': {
            items: [
                '<span style="color: #42a647;">resume.pdf</span>',
                '<span style="color: #42a647;">notes.txt</span>'
            ],
            subdirs: []
        },
        '~/images': {
            items: [
                '<span style="color: #42a647;">profile.png</span>',
                '<span style="color: #42a647;">logo.png</span>',
                '<span style="color: #42a647;">screenshot.png</span>'
            ],
            subdirs: []
        }
    },

    files: {
        'readme.md': 'Welcome to my terminal portfolio! Type "help" to see available commands.',
        'profile.txt': 'This is a simulated file system. Try exploring with ls and cat commands.',
        'contact.info': 'Email: info@siege.sh\nGitHub: https://github.com/nilicule\nTwitter: https://x.com/nilicule',
        'resume.pdf': '[This would be a PDF file in a real system]',
        'documents/resume.pdf': '[This would be a PDF file in a real system]',
        'documents/notes.txt': 'Remember to update portfolio with latest projects.\nLook into new side project ideas.\nDeploy siege.sh v2.',
        'projects/beats.rc6.org.link': 'https://beats.rc6.org',
        'projects/n2g.dev.link': 'https://n2g.dev',
        'projects/nilicule.com.link': 'https://nilicule.com',
        'projects/rc6.org.link': 'https://rc6.org',
        'images/profile.png': `
    +-------+
   /  ^   ^  \\
  | (o) (o) |
  |    <>    |
  |  \\____/  |
   \\         /
    +---------+
  nilicule, developer`,
        'images/logo.png': `
 ___  _  ___  ___  ___
/ __|| || __|/ __|| __|
\\__ \\| || _|| (_ || _|
|___/|_||___|\\___|\\___| .sh`,
        'images/screenshot.png': `
+-------------------------------+
| nilicule@siege.sh:~$ ls      |
| projects/ documents/ images/ |
| nilicule@siege.sh:~$         |
+-------------------------------+`
    }
};

// Command processor
const CommandProcessor = {
    commands: {
        'help': {
            description: 'Display help information',
            execute: function () {
                return document.getElementById('help-template').innerHTML;
            }
        },
        'projects': {
            description: 'List my projects',
            execute: function () {
                return document.getElementById('projects-template').innerHTML;
            }
        },
        'contact': {
            description: 'Get my contact information',
            execute: function () {
                return document.getElementById('contact-template').innerHTML;
            }
        },
        'about': {
            description: 'Show information about me',
            execute: function () {
                return document.getElementById('about-template').innerHTML;
            }
        },
        'whoami': {
            description: 'Reveal your mysterious digital persona',
            execute: function () {
                const template = document.getElementById('whoami-template').innerHTML;
                const resultElement = document.createElement('div');
                resultElement.innerHTML = template;

                // Get visitor information
                const whoamiOutput = resultElement.querySelector('#whoami-output');
                if (whoamiOutput) {
                    Utils.detectVisitorInfo(whoamiOutput);
                }

                return resultElement.innerHTML;
            }
        },
        'clear': {
            description: 'Clear the terminal screen',
            execute: function () {
                Terminal.clear();
                return null;
            }
        },
        'ls': {
            description: 'List directory contents',
            execute: function (args) {
                let targetPath = FileSystem.currentPath;
                if (args && args.trim()) {
                    const target = args.trim().replace(/\/$/, '');
                    const resolved = FileSystem.currentPath === '~' ? '~/' + target : FileSystem.currentPath + '/' + target;
                    if (!FileSystem.directories[resolved]) {
                        return `<div class="output" style="color: var(--error-color);">ls: cannot access '${target}': No such file or directory</div>`;
                    }
                    targetPath = resolved;
                }
                const dir = FileSystem.directories[targetPath];
                if (!dir) return '<div class="output" style="color: var(--error-color);">ls: cannot access directory</div>';
                return `<div class="output">${dir.items.join('&nbsp;&nbsp;&nbsp;')}</div>`;
            }
        },
        'cat': {
            description: 'Display content of simulated files',
            execute: function (args) {
                const fileName = args ? args.trim() : '';
                if (!fileName) {
                    return '<div class="output" style="color: var(--error-color);">Usage: cat [filename]</div>';
                }

                const subdir = FileSystem.currentPath === '~' ? '' : FileSystem.currentPath.replace('~/', '') + '/';
                const lookupKey = subdir + fileName.toLowerCase();
                const content = FileSystem.files[lookupKey];
                if (content) {
                    return `<div class="output">${content.replace(/\n/g, '<br>')}</div>`;
                } else {
                    return `<div class="output" style="color: var(--error-color);">cat: ${fileName}: No such file or directory</div>`;
                }
            }
        },
        'cd': {
            description: 'Change directory',
            execute: function (args) {
                const target = args ? args.trim().replace(/\/$/, '') : '';

                if (target === '' || target === '~') {
                    FileSystem.currentPath = '~';
                    return null;
                }

                if (target === '..') {
                    if (FileSystem.currentPath !== '~') {
                        FileSystem.currentPath = '~';
                    }
                    return null;
                }

                const newPath = FileSystem.currentPath + '/' + target;
                if (FileSystem.directories[newPath]) {
                    FileSystem.currentPath = newPath;
                    return null;
                } else {
                    return `<div class="output" style="color: var(--error-color);">cd: ${target}: No such file or directory</div>`;
                }
            }
        },
        'pwd': {
            description: 'Print working directory',
            execute: function () {
                const full = FileSystem.currentPath.replace('~', '/home/nilicule');
                return `<div class="output">${full}</div>`;
            }
        },
        'uname': {
            description: 'Print system information',
            execute: function (args) {
                const release = SIEGE_VERSION.toLowerCase().replace(' ', '-');
                const info = {
                    s: 'Linux',
                    n: 'siege.sh',
                    r: release,
                    v: `#1 SMP siege.sh ${SIEGE_VERSION}`,
                    m: 'x86_64',
                    o: 'GNU/Linux'
                };

                const flags = args ? args.trim() : '';

                if (!flags) return `<div class="output">${info.s}</div>`;

                if (flags === '-a') {
                    return `<div class="output">${info.s} ${info.n} ${info.r} ${info.v} ${info.m} ${info.o}</div>`;
                }

                const flagMap = { '-s': 's', '-n': 'n', '-r': 'r', '-v': 'v', '-m': 'm', '-o': 'o' };
                const parts = flags.split(/\s+/).map(f => {
                    if (!flagMap[f]) return { error: f };
                    return info[flagMap[f]];
                });

                const error = parts.find(p => p && p.error);
                if (error) return `<div class="output" style="color: var(--error-color);">uname: invalid option -- '${error.error}'</div>`;

                return `<div class="output">${parts.join(' ')}</div>`;
            }
        },
        'open': {
            description: 'Open a .link file in a new tab',
            execute: function (args) {
                const fileName = args ? args.trim() : '';
                if (!fileName) {
                    return '<div class="output" style="color: var(--error-color);">Usage: open [filename]</div>';
                }

                const subdir = FileSystem.currentPath === '~' ? '' : FileSystem.currentPath.replace('~/', '') + '/';
                const lookupKey = subdir + fileName.toLowerCase();
                const content = FileSystem.files[lookupKey];

                if (!content) {
                    return `<div class="output" style="color: var(--error-color);">open: ${fileName}: No such file</div>`;
                }

                if (!fileName.endsWith('.link')) {
                    return `<div class="output" style="color: var(--error-color);">open: ${fileName}: Not a link file</div>`;
                }

                window.open(content.trim(), '_blank');
                return `<div class="output">Opening <a href="${content.trim()}" target="_blank" style="color: var(--accent-color);">${content.trim()}</a>...</div>`;
            }
        },
        'ping': {
            description: 'Ping a host and measure round-trip time',
            execute: function (args) {
                if (!args) return '<div class="output" style="color: var(--error-color);">Usage: ping [host]</div>';

                const host = args.trim();
                const url = host.startsWith('http') ? host : 'https://' + host;
                const rtts = [];
                let sent = 0;

                Terminal.displayResult(`<div class="output">PING ${host}: 56 data bytes</div>`);

                function sendPing(seq) {
                    const start = performance.now();
                    fetch(url, { mode: 'no-cors', cache: 'no-store' })
                        .then(() => {
                            const rtt = (performance.now() - start).toFixed(1);
                            rtts.push(parseFloat(rtt));
                            Terminal.displayResult(`<div class="output">64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${rtt} ms</div>`);
                        })
                        .catch(() => {
                            Terminal.displayResult(`<div class="output" style="color: var(--error-color);">Request timeout for icmp_seq=${seq}</div>`);
                        })
                        .finally(() => {
                            sent++;
                            if (sent < 4) {
                                setTimeout(() => sendPing(sent), 300);
                            } else {
                                setTimeout(() => {
                                    Terminal.displayResult(`<div class="output">--- ${host} ping statistics ---</div>`);
                                    if (rtts.length > 0) {
                                        const min = Math.min(...rtts).toFixed(1);
                                        const max = Math.max(...rtts).toFixed(1);
                                        const avg = (rtts.reduce((a, b) => a + b) / rtts.length).toFixed(1);
                                        const loss = (((4 - rtts.length) / 4) * 100).toFixed(0);
                                        Terminal.displayResult(`<div class="output">4 packets transmitted, ${rtts.length} received, ${loss}% packet loss</div>`);
                                        Terminal.displayResult(`<div class="output">round-trip min/avg/max = ${min}/${avg}/${max} ms</div>`);
                                    } else {
                                        Terminal.displayResult(`<div class="output" style="color: var(--error-color);">4 packets transmitted, 0 received, 100% packet loss</div>`);
                                    }
                                }, 200);
                            }
                        });
                }

                setTimeout(() => sendPing(0), 100);
                return null;
            }
        },
        'traceroute': {
            description: 'Trace the route to a host',
            execute: function (args) {
                if (!args) return '<div class="output" style="color: var(--error-color);">Usage: traceroute [host]</div>';

                const host = args.trim();
                const silentHops = new Set([3, 6]);
                const fakeIps = [
                    '192.168.1.1', '10.0.0.1', null,
                    '72.14.215.165', '108.170.246.1', null,
                    '209.85.255.136', host
                ];

                Terminal.displayResult(`<div class="output">traceroute to ${host}, 30 hops max, 60 byte packets</div>`);

                fakeIps.forEach((ip, idx) => {
                    const hop = idx + 1;
                    setTimeout(() => {
                        if (silentHops.has(hop)) {
                            Terminal.displayResult(`<div class="output">${String(hop).padStart(2)}  * * *</div>`);
                        } else {
                            const base = 2 + hop * 5 + Math.random() * 4;
                            const t1 = base.toFixed(1);
                            const t2 = (base - Math.random() * 0.5).toFixed(1);
                            const t3 = (base + Math.random() * 1.5).toFixed(1);
                            Terminal.displayResult(`<div class="output">${String(hop).padStart(2)}  ${ip}  ${t1} ms  ${t2} ms  ${t3} ms</div>`);
                        }
                    }, 150 * (hop + 1));
                });

                return null;
            }
        },
        'curl': {
            description: 'Transfer data from a URL',
            execute: function (args) {
                if (!args) return '<div class="output" style="color: var(--error-color);">Usage: curl [url]</div>';

                const url = args.trim();
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    return '<div class="output" style="color: var(--error-color);">curl: URL must start with http:// or https://</div>';
                }

                let host;
                try {
                    host = new URL(url).hostname;
                } catch (e) {
                    return `<div class="output" style="color: var(--error-color);">curl: (3) URL malformed: ${url}</div>`;
                }

                Terminal.displayResult(`<div class="output">* Trying ${host}...<br>* Connected to ${host} port ${url.startsWith('https') ? 443 : 80}<br>&gt; GET / HTTP/1.1<br>&gt; Host: ${host}<br>&gt; User-Agent: curl/7.88.1<br>&gt; Accept: */*<br>&gt;</div>`);

                fetch(url)
                    .then(response => {
                        let headersHtml = `&lt; HTTP/${response.status >= 200 ? '2' : '1.1'} ${response.status} ${response.statusText || ''}<br>`;
                        response.headers.forEach((value, name) => {
                            headersHtml += `&lt; ${name}: ${value}<br>`;
                        });
                        headersHtml += '&lt;<br>[Response body omitted]';
                        Terminal.displayResult(`<div class="output">${headersHtml}</div>`);
                    })
                    .catch(() => {
                        Terminal.displayResult(`<div class="output" style="color: var(--error-color);">curl: (6) Could not resolve host: ${host}</div>`);
                    });

                return null;
            }
        },
        'ifconfig': {
            description: 'Display network interface configuration',
            execute: function () {
                const lastOctet = Math.floor(Math.random() * 253) + 2;
                const mac = Array.from({ length: 6 }, () =>
                    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
                ).join(':');

                let connectionInfo = '';
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (conn) {
                    const parts = [];
                    if (conn.effectiveType) parts.push(`type: ${conn.effectiveType}`);
                    if (conn.downlink) parts.push(`downlink: ${conn.downlink} Mbps`);
                    if (conn.rtt) parts.push(`rtt: ${conn.rtt} ms`);
                    if (parts.length) connectionInfo = `\n      ${parts.join('  ')}`;
                }

                const output = `lo0: flags=8049&lt;UP,LOOPBACK,RUNNING,MULTICAST&gt; mtu 16384
      inet 127.0.0.1 netmask 0xff000000

eth0: flags=8863&lt;UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST&gt; mtu 1500
      inet 192.168.1.${lastOctet} netmask 0xffffff00 broadcast 192.168.1.255
      ether ${mac}
      media: autoselect (1000baseT &lt;full-duplex&gt;)
      status: active${connectionInfo}`;

                return `<div class="output"><pre>${output}</pre></div>`;
            }
        },
        'echo': {
            description: 'Display a line of text',
            execute: function (args) {
                const text = args ? args : '';
                return `<div class="output">${text}</div>`;
            }
        },
        'date': {
            description: 'Display the current date and time',
            execute: function () {
                const now = new Date();
                const options = {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                };
                return `<div class="output">${now.toLocaleDateString('en-US', options)}</div>`;
            }
        },
        // Add this inside the commands object
        'matrix': {
            description: 'Trigger Matrix falling code effect',
            execute: function () {
                // Prevent multiple overlays
                if (document.getElementById('matrix-canvas')) return '<div class="output">Matrix effect already running.</div>';

                const container = document.getElementById('terminal-container') || document.body;
                const canvas = document.createElement('canvas');
                canvas.id = 'matrix-canvas';
                canvas.style.position = 'fixed';
                canvas.style.top = 0;
                canvas.style.left = 0;
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = 9999;
                container.appendChild(canvas);

                const ctx = canvas.getContext('2d');
                let width = window.innerWidth;
                let height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;

                const letters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                const fontSize = 18;
                const columns = Math.floor(width / fontSize);
                const drops = Array(columns).fill(1);

                function draw() {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                    ctx.fillRect(0, 0, width, height);
                    ctx.fillStyle = '#0F0';
                    ctx.font = fontSize + 'px monospace';
                    for (let i = 0; i < drops.length; i++) {
                        const text = letters.charAt(Math.floor(Math.random() * letters.length));
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                        if (drops[i] * fontSize > height && Math.random() > 0.975) {
                            drops[i] = 0;
                        }
                        drops[i]++;
                    }
                }

                let interval = setInterval(draw, 33);

                // Remove effect after 10 seconds
                setTimeout(() => {
                    clearInterval(interval);
                    canvas.remove();
                }, 10000);

                // Adjust canvas on resize
                window.addEventListener('resize', function onResize() {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                });

                return '<div class="output">Welcome to the Matrix...</div>';
            }
        },
        'fortune': {
            description: 'Display a random fortune',
            execute: function () {
                const fortunes = [
                    "You will find a hidden treasure where you least expect it.",
                    "A journey of a thousand miles begins with a single step.",
                    "The greatest risk is not taking one.",
                    "Your code will work on the first try. Just kidding.",
                    "You will soon embark on a new adventure.",
                    "A bug in the hand is better than one in the production environment.",
                    "The best code is no code at all.",
                    "You will meet a tall, dark, and handsome... bug in your code.",
                    "Your commit will pass all tests. Eventually.",
                    "Today is your lucky day. Your PR will be approved without comments."
                ];
                const randomIndex = Math.floor(Math.random() * fortunes.length);
                return `<div class="output" style="color: #f0c674;">${fortunes[randomIndex]}</div>`;
            }
        },
        'cowsay': {
            description: 'Display an ASCII cow with a message',
            execute: function (args) {
                const message = args ? args : 'Moo!';
                const messageLength = message.length;
                const border = '-'.repeat(messageLength + 2);

                const cow = `
 < ${message} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
                `;
                return `<div class="output"><pre>${cow}</pre></div>`;
            }
        },
        'sl': {
            description: 'Display an ASCII train animation',
            execute: function () {
                const train = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
   /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
  |      |  |   H  |__--------------------| [___] |   =|                        |
  | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
  |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/
`;
                return `<div class="output"><pre>${train}</pre></div>`;
            }
        },
        'figlet': {
            description: 'Display text in ASCII art',
            execute: function (args) {
                const text = args ? args : 'Hello!';
                // Simple ASCII art for common letters
                const asciiArt = {
                    'H': ' _   _ \n| | | |\n| |_| |\n|  _  |\n|_| |_|\n',
                    'E': ' _____ \n|  ___|\n| |___ \n|  ___|\n|_____|\n',
                    'L': ' _     \n| |    \n| |    \n| |___ \n|_____|\n',
                    'O': ' _____ \n|  _  |\n| | | |\n| |_| |\n|_____|\n',
                    '!': ' _ \n| |\n| |\n|_|\n(_)\n',
                    ' ': '   \n   \n   \n   \n   \n'
                };

                // Convert input to uppercase and generate ASCII art
                let result = '';
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < text.length; j++) {
                        const char = text[j].toUpperCase();
                        if (asciiArt[char]) {
                            const lines = asciiArt[char].split('\n');
                            result += lines[i] || '';
                        } else {
                            result += '   ';
                        }
                    }
                    result += '\n';
                }

                return `<div class="output"><pre>${result}</pre></div>`;
            }
        },
        'rev': {
            description: 'Reverse a string',
            execute: function (args) {
                const text = args ? args : '';
                const reversed = text.split('').reverse().join('');
                return `<div class="output">${reversed}</div>`;
            }
        },
        'lolcat': {
            description: 'Display text in rainbow colors',
            execute: function (args) {
                const text = args ? args : 'Rainbow Text';
                let coloredText = '';
                const colors = [
                    '#ff0000', '#ff7f00', '#ffff00', '#00ff00',
                    '#0000ff', '#4b0082', '#9400d3'
                ];

                for (let i = 0; i < text.length; i++) {
                    const colorIndex = i % colors.length;
                    coloredText += `<span style="color: ${colors[colorIndex]}">${text[i]}</span>`;
                }

                return `<div class="output">${coloredText}</div>`;
            }
        },
        'neofetch': {
            description: 'Display system information in a stylized format',
            execute: function () {
                // Get OS information
                const userAgent = navigator.userAgent;
                let osName = "Unknown OS";
                let osLogo = "";

                if (userAgent.indexOf("Win") !== -1) {
                    osName = "Windows";
                    osLogo = `
    ,.=:!!t3Z3z.,               
   :tt:::tt333EE3               
   Et:::ztt33EEEL  @Ee.,      ..,
  ;tt:::tt333EE7  ;EEEEEEttttt33#
 :Et:::zt333EEQ.  $EEEEEttttt33QL
 it::::tt333EEF   @EEEEEEttttt33F
;3=*^\`\`\`'*4EEV    :EEEEEEttttt33@.
,.=::::!t=., \`    @EEEEEEtttz33QF
^r::::::::==::.   :EEEEEEttttt33F
 ::::::::::::::.   SEEEEEttttt33F
 :::::::::::::::    "4EEEtttji3P"
 ::::::::::::::.       \`\`\`\`
 \`:::::::::::::::..
   \`\`\`\`\`\`\`\`\`\`\`\`\`\`
`;
                } else if (userAgent.indexOf("Mac") !== -1) {
                    osName = "MacOS";
                    osLogo = `
                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.
`;
                } else if (userAgent.indexOf("Linux") !== -1) {
                    osName = "Linux";
                    osLogo = `
                   .
                  .vir.
                 .d$$$$$$b.
               .$$$$$$$$$$$b.
             .$$$$$$$$$$$$$$$b.
           .$$$$$$$$$$$$$$$$$$$b.
         .$$$$$$$$$$$$$$$$$$$$$$$b.
       .$$$$$$$$$$$$$$$$$$$$$$$$$$$b.
      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
`;
                } else if (userAgent.indexOf("Android") !== -1) {
                    osName = "Android";
                    osLogo = `
         .-.
       /|   \\
     /  |    \\
    |   |     |
    |   |     |
    |   |     |
     \\  |    /
       \\|   /
         '-'
`;
                } else if (userAgent.indexOf("iOS") !== -1 || userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) {
                    osName = "iOS";
                    osLogo = `
       .:'
    _ :'_
 .'  \_\`  \`.
:  .\/.\/. :
:   /    \  :
 :  \\    /  :
  \`. \\/\/ .'
    \`-::-'
`;
                }

                // Get browser information
                let browserName = "Unknown Browser";
                if (userAgent.indexOf("Chrome") !== -1) browserName = "Chrome";
                else if (userAgent.indexOf("Firefox") !== -1) browserName = "Firefox";
                else if (userAgent.indexOf("Safari") !== -1) browserName = "Safari";
                else if (userAgent.indexOf("Edge") !== -1) browserName = "Edge";
                else if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1) browserName = "Opera";

                // Get screen resolution
                const resolution = `${window.screen.width}x${window.screen.height}`;

                // Get timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";

                // Format the output
                const info = `
<span style="color: #4e94ce;">OS:</span> ${osName}
<span style="color: #4e94ce;">Browser:</span> ${browserName}
<span style="color: #4e94ce;">Resolution:</span> ${resolution}
<span style="color: #4e94ce;">Timezone:</span> ${timezone}
<span style="color: #4e94ce;">User Agent:</span> ${userAgent.substring(0, 50)}...
`;

                return `<div class="output"><pre style="color: #42a647; display: inline-block; vertical-align: top; margin-right: 20px;">${osLogo}</pre><pre style="display: inline-block; vertical-align: top;">${info}</pre></div>`;
            }
        }
    },

    process: function (commandInput) {
        // Split the input into command and arguments
        const parts = commandInput.split(' ');
        const command = parts[0];
        const args = parts.length > 1 ? parts.slice(1).join(' ') : '';

        if (this.commands[command]) {
            const result = this.commands[command].execute(args);
            if (result !== null) {
                Terminal.displayResult(result);
            }
        } else {
            Terminal.displayResult(`Command not found: ${command}. Type 'help' to see available commands.`, true);
        }
    },

    getAvailableCommands: function () {
        return Object.keys(this.commands);
    },

    // Method to register new commands
    register: function (name, description, executeFunction) {
        this.commands[name] = {
            description: description,
            execute: executeFunction
        };
    }
};
