// Terminal functionality
const Terminal = {
    output: null,
    input: null,
    terminal: null,
    commandHistory: [],
    historyIndex: -1,
    observer: null,

    init: function() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('command-input');
        this.terminal = document.querySelector('.terminal');

        // Focus input on click anywhere in the terminal
        this.terminal.addEventListener('click', () => {
            this.input.focus();
        });

        // Add event listeners
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));

        // Add mutation observer to auto-scroll when content changes
        this.observer = new MutationObserver(() => {
            this.scrollToBottom();
        });

        this.observer.observe(this.output, { childList: true, subtree: true });
    },

    handleKeydown: function(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim().toLowerCase();

            if (command) {
                // Add command to history
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;

                // Display command
                this.displayCommand(command);

                // Process command
                CommandProcessor.process(command);

                // Clear input
                this.input.value = '';

                // Force scroll to bottom
                this.scrollToBottom();
            }
        } else if (e.key === 'ArrowUp') {
            // Navigate command history (up)
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            // Navigate command history (down)
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else if (this.historyIndex === this.commandHistory.length - 1) {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            // Simple tab completion
            e.preventDefault();
            const availableCommands = CommandProcessor.getAvailableCommands();
            const input = this.input.value.trim().toLowerCase();

            if (input) {
                const match = availableCommands.find(cmd => cmd.startsWith(input));
                if (match) {
                    this.input.value = match;
                }
            }
        }
    },

    displayCommand: function(command) {
        const commandElement = document.createElement('div');
        commandElement.classList.add('output');
        commandElement.innerHTML = `<span class="prompt-text" style="display: inline-block; width: 185px;">nilicule@siege.sh:~$</span>${command}`;
        this.output.appendChild(commandElement);
    },

    displayResult: function(html, isError = false) {
        const resultElement = document.createElement('div');
        resultElement.classList.add('command-result');

        if (isError) {
            resultElement.style.color = 'var(--error-color)';
            resultElement.textContent = html;
        } else {
            resultElement.innerHTML = html;
        }

        this.output.appendChild(resultElement);
        this.scrollToBottom();
    },

    clear: function() {
        this.output.innerHTML = '';
    },

    scrollToBottom: function() {
        window.requestAnimationFrame(() => {
            this.terminal.scrollTop = this.terminal.scrollHeight;
            // Double-check after a delay
            setTimeout(() => {
                this.terminal.scrollTop = this.terminal.scrollHeight;
            }, 100);
        });
    }
};