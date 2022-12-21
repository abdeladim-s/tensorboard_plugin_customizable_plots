export async function render() {
    // Bootstrap: main contents are in `index.html` and friends.
    const iframe = document.createElement("iframe");

    iframe.src = "./static/index.html";
    iframe.style.width = "100%";
    iframe.style.height = "99vh";
    iframe.style.border = 'none';
    document.body.style.margin = 'unset';
    // document.body.style.backgroundColor = '#E7EBF0';
    document.body.appendChild(iframe);

}