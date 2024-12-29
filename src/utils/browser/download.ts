export function download(fileName = "报表.xlsx") {
    return (blob: Blob) => {
        const elink = document.createElement("a"); //创建一个a标签通过a标签的点击事件区下载文件
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob); //使用blob创建一个指向类型数组的URL
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
    };
}
