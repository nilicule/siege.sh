document.addEventListener('DOMContentLoaded', function() {
    // Initialize the terminal
    Terminal.init();

    // Load command templates
    loadTemplates([
        'help',
        'projects',
        'contact',
        'about',
        'whoami'
    ]);

    // Display a random ASCII art logo
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer && Logos) {
        // Add overflow handling to prevent scrolling issues
        logoContainer.style.overflow = 'hidden';
        logoContainer.style.maxWidth = '100%';
        logoContainer.style.whiteSpace = 'pre';
        // Set the logo text
        logoContainer.textContent = Logos.getRandomLogo();
    }

    // Set current date and time
    const now = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
});

// Function to load HTML templates
function loadTemplates(templateNames) {
    const templatesContainer = document.getElementById('templates-container');

    // Load each template
    templateNames.forEach(name => {
        fetch(`templates/${name}.html`)
            .then(response => response.text())
            .then(html => {
                const templateDiv = document.createElement('div');
                templateDiv.id = `${name}-template`;
                templateDiv.classList.add('hidden');
                templateDiv.innerHTML = html;
                templatesContainer.appendChild(templateDiv);
            })
            .catch(error => console.error(`Failed to load template: ${name}`, error));
    });
}
