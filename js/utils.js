// Utility functions
const Utils = {
    // Detect visitor information
    detectVisitorInfo: function(outputElement) {
        // Get OS information
        let osName = "Unknown OS";
        const userAgent = navigator.userAgent;

        if (userAgent.indexOf("Win") !== -1) osName = "Windows";
        else if (userAgent.indexOf("Mac") !== -1) osName = "MacOS";
        else if (userAgent.indexOf("Linux") !== -1) osName = "Linux";
        else if (userAgent.indexOf("Android") !== -1) osName = "Android";
        else if (userAgent.indexOf("iOS") !== -1 || userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) osName = "iOS";

        // Try to get CPU architecture
        let cpuArch = "Unknown";
        if (userAgent.indexOf("x86_64") !== -1 || userAgent.indexOf("x64") !== -1) cpuArch = "x64";
        else if (userAgent.indexOf("arm") !== -1 || userAgent.indexOf("ARM") !== -1) cpuArch = "ARM";
        else if (userAgent.indexOf("x86") !== -1 || userAgent.indexOf("i386") !== -1) cpuArch = "x86";

        // Combine architecture and OS
        let deviceInfo = "";
        if (osName === "MacOS") {
            if (userAgent.indexOf("Intel") !== -1) deviceInfo = "macintel";
            else if (userAgent.indexOf("ARM") !== -1 || userAgent.indexOf("Apple") !== -1) deviceInfo = "macarm";
            else deviceInfo = "mac";
        } else {
            deviceInfo = osName.toLowerCase();
            if (cpuArch !== "Unknown") deviceInfo += "-" + cpuArch.toLowerCase();
        }

        // Try to get timezone/location info
        let locationInfo = "Unknown";
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
                // Extract region from timezone (e.g., "Europe/Amsterdam" -> "Europe_Amsterdam")
                locationInfo = timezone.replace('/', '_');
            }
        } catch (e) {
            // Timezone detection failed
            locationInfo = "Unknown";
        }

        // Format the final output
        const userInfo = `guest@${deviceInfo}-${locationInfo}`;
        outputElement.textContent = userInfo;
    }
};