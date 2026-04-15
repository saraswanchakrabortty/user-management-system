export const formatDate = (date) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(date));
};

export const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const roleColor = (role) => ({
    admin: "danger",
    manager: "warning",
    user: "info",
}[role] || "info");

export const statusColor = (status) =>
    status === "active" ? "success" : "danger";