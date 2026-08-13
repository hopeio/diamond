export function download(fileName = "报表.xlsx") {
    return (blob: Blob) => {
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        const url = URL.createObjectURL(blob);
        elink.href = url;
        document.body.appendChild(elink);
        try {
            elink.click();
        } finally {
            document.body.removeChild(elink);
            // Safari/WebKit 在 click 后异步读取 blob，立即 revoke 会偶发下载失败或空文件
            setTimeout(() => URL.revokeObjectURL(url), 10_000);
        }
    };
}
