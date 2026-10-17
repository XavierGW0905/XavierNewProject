
const API_URL = "https://xavier-flask-api.onrender.com/api/health";

const apiMetric = document.getElementById("api-metric");
const apiDetail = document.getElementById("api-detail");
const apiDot = document.getElementById("api-dot");
const apiBadge = document.getElementById("api-badge");
const lastChecked = document.getElementById("last-checked");
const refreshButton = document.getElementById("refresh-button");
const checkApiButton = document.getElementById("check-api-button");
const notice = document.getElementById("notice");
const activityList = document.getElementById("activity-list");

const pageDetails = {
    overview: {
        title: "Platform Overview",
        breadcrumb: "Overview",
        description: "Monitor your services, infrastructure and platform health."
    },
    services: {
        title: "Service Monitoring",
        breadcrumb: "Services",
        description: "Check the health of your application services."
    },
    infrastructure: {
        title: "Infrastructure",
        breadcrumb: "Infrastructure",
        description: "Explore your platform components and planned integrations."
    },
    activity: {
        title: "Recent Activity",
        breadcrumb: "Activity",
        description: "Review recent dashboard events and health checks."
    }
};

function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.hidden = false;
    notice.classList.toggle("error", isError);
}

function hideNotice() {
    notice.hidden = true;
    notice.classList.remove("error");
}

function updateApiStatus(isHealthy, message) {
    apiMetric.textContent = isHealthy ? "Healthy" : "Unavailable";
    apiDetail.textContent = message;

    apiDot.style.background = isHealthy ? "#43d6a0" : "#ff9ba8";

    apiBadge.textContent = isHealthy ? "Healthy" : "Unavailable";
    apiBadge.className = isHealthy
        ? "status-badge status-online"
        : "status-badge status-offline";
}

function addActivity(title, description, isHealthy) {
    const item = document.createElement("div");
    item.className = "activity-item";

    const marker = document.createElement("span");
    marker.className = "activity-marker " +
        (isHealthy ? "green" : "purple");

    const copy = document.createElement("div");
    copy.className = "activity-copy";

    const heading = document.createElement("strong");
    heading.textContent = title;

    const detail = document.createElement("p");
    detail.textContent = description;

    const time = document.createElement("time");
    time.textContent = new Date().toLocaleTimeString();

    copy.append(heading, detail);
    item.append(marker, copy, time);
    activityList.prepend(item);

    // Keep the activity list from growing indefinitely.
    while (activityList.children.length > 8) {
        activityList.lastElementChild.remove();
    }
}

async function checkApiHealth() {
    hideNotice();

    refreshButton.disabled = true;
    checkApiButton.disabled = true;

    apiMetric.textContent = "Checking...";
    apiDetail.textContent = "Requesting API health";
    apiBadge.textContent = "Checking";
    apiBadge.className = "status-badge status-checking";

    let isHealthy = false;

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("API returned HTTP " + response.status);
        }

        const data = await response.json();

        if (data.status !== "healthy") {
            throw new Error("API returned an unexpected health status");
        }

        isHealthy = true;

        updateApiStatus(
            true,
            data.application || "Application responding"
        );

        showNotice(
            "Success: " + (data.application || "XavierProject") +
            " API is healthy."
        );

        addActivity(
            "API health check passed",
            "The Flask API returned a healthy status.",
            true
        );

    } catch (error) {
        updateApiStatus(false, "Unable to reach the API");

        showNotice(
            "API check failed. " + error.message +
            " Check that Flask is running and the frontend origin is allowed by CORS.",
            true
        );

        addActivity(
            "API health check failed",
            "The dashboard could not confirm API health.",
            false
        );

        console.error("XavierProject API health check:", error);

    } finally {
        lastChecked.textContent =
            "Last checked: " + new Date().toLocaleTimeString();

        refreshButton.disabled = false;
        checkApiButton.disabled = false;
    }
}

function navigateTo(page) {
    const details = pageDetails[page];

    if (!details) {
        return;
    }

    document.getElementById("page-title").textContent = details.title;
    document.getElementById("breadcrumb-page").textContent =
        details.breadcrumb;
    document.getElementById("page-description").textContent =
        details.description;

    document.querySelectorAll(".nav-link").forEach(link => {
        const active = link.dataset.page === page;

        link.classList.toggle("active", active);

        if (active) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    const targets = {
        overview: null,
        services: "service-panel",
        infrastructure: "infrastructure-panel",
        activity: "activity-panel"
    };

    const targetId = targets[page];

    if (targetId) {
        document.getElementById(targetId).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    closeMobileMenu();
}

function closeMobileMenu() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("menu-toggle")
        .setAttribute("aria-expanded", "false");
}

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        navigateTo(link.dataset.page);
    });
});

refreshButton.addEventListener("click", checkApiHealth);
checkApiButton.addEventListener("click", checkApiHealth);

document.getElementById("current-date").textContent =
    new Date().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

document.getElementById("menu-toggle").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const isOpen = sidebar.classList.toggle("open");

    document.getElementById("menu-toggle")
        .setAttribute("aria-expanded", String(isOpen));
});

// Run one real API health check when the dashboard loads.
checkApiHealth();
