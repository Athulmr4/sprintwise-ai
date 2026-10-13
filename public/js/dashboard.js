
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


const loadRecentProjects = async () => {
    const container = document.getElementById("recent-projects");
    const projectsMessage = document.getElementById("projects-message");

    projectsMessage.textContent = "Loading projects...";
    container.replaceChildren();

    try {
        const data = await fetchJson("/api/dashboard/recent-projects");
        const projects = data.projects;

        if (projects.length === 0) {
            projectsMessage.textContent =
                "No projects yet. Create a project to see it here.";
            return;
        }

        projectsMessage.textContent = `${projects.length} recent project(s)`;

        const statusStyles = {
            planned: "bg-slate-700 text-slate-200",
            active: "bg-indigo-500/20 text-indigo-300",
            completed: "bg-emerald-500/20 text-emerald-300",
            archived: "bg-amber-500/20 text-amber-300"
        };

        projects.forEach((project) => {
            const card = document.createElement("article");
            card.className =
                "rounded-xl border border-slate-800 bg-slate-900 p-5";

            const heading = document.createElement("h3");
            heading.className = "text-lg font-semibold";
            heading.textContent = project.name;

            const status = document.createElement("span");
            status.className =
                `mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[project.status] ||
                    "bg-slate-700 text-slate-200"
                }`;
            status.textContent = project.status.replace("_", " ");

            const taskCount = document.createElement("p");
            taskCount.className = "mt-5 text-sm text-slate-400";
            taskCount.textContent =
                `${project.completedTasks} of ${project.totalTasks} tasks completed`;

            const progressHeader = document.createElement("div");
            progressHeader.className =
                "mt-4 flex justify-between text-sm";

            const progressLabel = document.createElement("span");
            progressLabel.className = "text-slate-400";
            progressLabel.textContent = "Progress";

            const percentage = document.createElement("span");
            percentage.className = "font-medium";
            percentage.textContent = `${project.completionRate}%`;

            progressHeader.append(progressLabel, percentage);

            const progressTrack = document.createElement("div");
            progressTrack.className =
                "mt-2 h-2 overflow-hidden rounded-full bg-slate-800";
            progressTrack.setAttribute("role", "progressbar");
            progressTrack.setAttribute("aria-label", `${project.name} progress`);
            progressTrack.setAttribute("aria-valuemin", "0");
            progressTrack.setAttribute("aria-valuemax", "100");
            progressTrack.setAttribute(
                "aria-valuenow",
                String(project.completionRate)
            );

            const progressBar = document.createElement("div");
            progressBar.className =
                "h-full rounded-full bg-indigo-500 transition-all";
            progressBar.style.width = `${project.completionRate}%`;

            progressTrack.appendChild(progressBar);
            card.append(heading, status, taskCount, progressHeader, progressTrack);
            container.appendChild(card);
        });
    } catch (error) {
        projectsMessage.textContent = error.message;
    }
};

loadRecentProjects();


loadDashboard();
