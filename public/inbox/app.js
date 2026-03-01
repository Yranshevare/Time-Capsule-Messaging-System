const eventSource = new EventSource(`http://localhost:3000/stream`);
// console.log("kk")

eventSource.onmessage = (event) => {

    const message = JSON.parse(event.data);
    console.log("New message received:", message);
    document.getElementById("messages").innerHTML += rteurnHtml(message.sender, message.time, message.message, message.isSent);
    // Update UI dynamically without reload
};

window.addEventListener("beforeunload", () => {
    console.log("Closing SSE connection...");
    eventSource.close();
});

function rteurnHtml(name, time, message, isSent) {
    let html = `
<div
    class="group p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all">
    <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex items-center gap-3">
            <div
                class="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-sm">
${name.slice(0, 2).toUpperCase()}</div>
            <div>
                <h4 class="font-bold text-slate-900 dark:text-slate-100">${name}</h4>
                <p class="text-xs text-slate-400 flex items-center gap-1">
                    <span
                        class="material-symbols-outlined text-[14px]">calendar_today</span>
                    ${new Date(Number(time)).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })}
                </p>
            </div>
        </div>
        </div>
    <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
        ${message}
    </p>
</div>
`

    return html
}
