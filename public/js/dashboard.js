
"use strict";

const message = document.getElementById("dashboard-message");
const refreshButton = document.getElementById("refresh-button");

let statusChart;
let priorityChart;

const setText = (id, value) => {
    document.getElementById(id).textContent = value;
};

const fetchJson = async (url) => {
    const response = await fetch(url, {
        credentials: "same-origin",
        headers: { Accept: "application/json" }
    });

    if (response.status === 401) {
        window.location.assign("/login");
        throw new Error("Your session has expired. Please sign in again.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard data.");
    }

    return data;
};

const renderStatusChart = (byStatus) => {
    const labels = ["To Do", "In Progress", "In Review", "Completed"];
    const values = [
        byStatus.todo,
        byStatus.in_progress,
        byStatus.in_review,
        byStatus.completed
    ];

    if (statusChart) statusChart.destroy();

    statusChart = new Chart(document.getElementById("status-chart"), {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ["#64748b", "#6366f1", "#f59e0b", "#10b981"],
                borderColor: "#0f172a",
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: "#cbd5e1", padding: 18 }
                }
            }
        }
    });
};

const renderPriorityChart = (byPriority) => {
    if (priorityChart) priorityChart.destroy();

    priorityChart = new Chart(document.getElementById("priority-chart"), {
        type: "bar",
        data: {
            labels: ["Low", "Medium", "High", "Urgent"],
            datasets: [{
                label: "Tasks",
                data: [
                    byPriority.low,
                    byPriority.medium,
                    byPriority.high,
                    byPriority.urgent
                ],
                backgroundColor: ["#64748b", "#6366f1", "#f59e0b", "#ef4444"],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: "#cbd5e1" },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#cbd5e1", precision: 0 },
                    grid: { color: "#334155" }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
};

const loadDashboard = async () => {
    refreshButton.disabled = true;
    message.textContent = "Loading dashboard data...";

    try {
        const [summaryData, analyticsData] = await Promise.all([
            fetchJson("/api/dashboard/summary"),
            fetchJson("/api/dashboard/analytics")
        ]);

        const summary = summaryData.summary;
        const analytics = analyticsData.analytics;

        setText("total-projects", summary.projects.total);
        setText("active-projects", summary.projects.active);
        setText("total-tasks", analytics.totalTasks);
        setText("overdue-tasks", summary.overdueTasks);
        setText("completion-rate", `${analytics.completionRate}%`);

        const progress = document.getElementById("completion-progress");
        progress.setAttribute("aria-valuenow", analytics.completionRate);

        document.getElementById("completion-bar").style.width =
            `${analytics.completionRate}%`;

        renderStatusChart(analytics.byStatus);
        renderPriorityChart(analytics.byPriority);

        message.textContent = "Dashboard data loaded successfully.";
    } catch (error) {
        message.textContent = error.message;
    } finally {
        refreshButton.disabled = false;
    }
};

refreshButton.addEventListener("click", loadDashboard);

document.getElementById("logout-button").addEventListener("click", async () => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error("Unable to log out. Please try again.");
        }

        window.location.assign("/login");
    } catch (error) {
        message.textContent = error.message;
    }
});

loadDashboard();
