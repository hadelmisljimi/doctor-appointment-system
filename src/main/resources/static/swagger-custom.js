window.addEventListener("load", () => {

    const observer = new MutationObserver(() => {

        const responseBlock = document.querySelector(".responses-wrapper");

        if (responseBlock && !document.getElementById("copy-token-btn")) {

            const btn = document.createElement("button");
            btn.id = "copy-token-btn";
            btn.innerText = "Copy token";

            btn.style.margin = "10px";
            btn.style.padding = "6px 10px";
            btn.style.cursor = "pointer";

            btn.onclick = () => {
                try {
                    const pre = document.querySelector(".response-col_description pre");
                    const obj = JSON.parse(pre.innerText);

                    navigator.clipboard.writeText(obj.token);
                    alert("Token copied!");
                } catch (e) {
                    alert("Token not found!");
                }
            };

            responseBlock.prepend(btn);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});