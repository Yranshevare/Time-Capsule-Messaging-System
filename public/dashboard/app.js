import { server } from "../constant.js";

const form = document.getElementById("sendMessageForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const name = document.getElementById("name").value;
    const time = document.getElementById("time").value;
    const message = document.getElementById("message").value;

    console.log(new Date(time).getTime())

    try {
        const res = await fetch(`${server}/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ receiver: name, time: new Date(time).getTime(), message })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Message scheduled successfully ✅");

            // Example: store token (if your backend sends one)
            // if (data.token) {
            //     localStorage.setItem("token", data.token);
            // }

            // redirect (optional)
            window.location.href = "/dashboard/index.html";
        } else {
            alert(data.message || "Message scheduling failed ❌");
        }

    } catch (err) {
        console.error(err);
        alert("Server error 🚨");
    }
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
        <span
            class="px-3 py-1 rounded-full ${isSent ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"} text-[10px] font-bold uppercase tracking-wider">${isSent ? "Sent" : "Scheduled"}</span>
    </div>
    <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
        ${message}
    </p>
</div>
`

    return html
}

(async function () {
    const res = await fetch(`${server}/message`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    console.log(data);
    data.forEach(element => {
        document.getElementById("messages").innerHTML += rteurnHtml(element.receiver, element.time, element.message, element.isSent)
    });
})()