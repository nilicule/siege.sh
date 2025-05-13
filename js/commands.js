// Command processor
const CommandProcessor = {
    commands: {
        'help': {
            description: 'Display help information',
            execute: function() {
                return document.getElementById('help-template').innerHTML;
            }
        },
        'projects': {
            description: 'List my projects',
            execute: function() {
                return document.getElementById('projects-template').innerHTML;
            }
        },
        'contact': {
            description: 'Get my contact information',
            execute: function() {
                return document.getElementById('contact-template').innerHTML;
            }
        },
        'about': {
            description: 'Show information about me',
            execute: function() {
                return document.getElementById('about-template').innerHTML;
            }
        },
        'whoami': {
            description: 'Reveal your mysterious digital persona',
            execute: function() {
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
            execute: function() {
                Terminal.clear();
                return null;
            }
        },
        'ls': {
            description: 'List simulated directory contents',
            execute: function() {
                const files = [
                    '<span style="color: #4e94ce;">projects/</span>',
                    '<span style="color: #4e94ce;">documents/</span>',
                    '<span style="color: #4e94ce;">images/</span>',
                    '<span style="color: #42a647;">README.md</span>',
                    '<span style="color: #42a647;">profile.txt</span>',
                    '<span style="color: #42a647;">contact.info</span>',
                    '<span style="color: #42a647;">resume.pdf</span>'
                ];
                return `<div class="output">${files.join('&nbsp;&nbsp;&nbsp;')}</div>`;
            }
        },
        'cat': {
            description: 'Display content of simulated files',
            execute: function(args) {
                const fileName = args ? args.trim() : '';
                if (!fileName) {
                    return '<div class="output" style="color: var(--error-color);">Usage: cat [filename]</div>';
                }

                const fileContents = {
                    'readme.md': 'Welcome to my terminal portfolio! Type "help" to see available commands.',
                    'profile.txt': 'This is a simulated file system. Try exploring with ls and cat commands.',
                    'contact.info': 'Email: contact@siege.sh\nGitHub: https://github.com/nilicule\nTwitter: https://x.com/nilicule',
                    'resume.pdf': '[This would be a PDF file in a real system]'
                };

                const content = fileContents[fileName.toLowerCase()];
                if (content) {
                    return `<div class="output">${content.replace(/\n/g, '<br>')}</div>`;
                } else {
                    return `<div class="output" style="color: var(--error-color);">cat: ${fileName}: No such file or directory</div>`;
                }
            }
        },
        'echo': {
            description: 'Display a line of text',
            execute: function(args) {
                const text = args ? args : '';
                return `<div class="output">${text}</div>`;
            }
        },
        'date': {
            description: 'Display the current date and time',
            execute: function() {
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
        'fortune': {
            description: 'Display a random fortune',
            execute: function() {
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
            execute: function(args) {
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
            execute: function() {
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
            execute: function(args) {
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
            execute: function(args) {
                const text = args ? args : '';
                const reversed = text.split('').reverse().join('');
                return `<div class="output">${reversed}</div>`;
            }
        },
        'lolcat': {
            description: 'Display text in rainbow colors',
            execute: function(args) {
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
            execute: function() {
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

    process: function(commandInput) {
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

    getAvailableCommands: function() {
        return Object.keys(this.commands);
    },

    // Method to register new commands
    register: function(name, description, executeFunction) {
        this.commands[name] = {
            description: description,
            execute: executeFunction
        };
    }
};
