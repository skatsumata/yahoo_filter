(() => {
    // フィルタリング対象のキーワード
    const blockKeywords = ["堀江", "成田","高須","美容","倉田真由美","ガーシー"];
    const blockProviders = ["Full", "ENCOUNT", "ANSWER", "スポーツ", "ABEMA", "プレジデント","PRESIDENT", "スポニチ","ゴールドオンライン", "ダイヤモンド", "FRIDAY","東スポ", "よろず", "Ameba", "ショッピング"];

    // ブロック統計情報
    let providerBlockCounts = {};  // providerごとの件数
    let providerCounts = {};  // providerごとの件数
    let reasonBlockCounts = { "provider": 0, "title": 0 };  // 理由ごとの件数

    function hideSidebarContent() {
        const contentWrapper = document.getElementById("ContentWrapper");
        if (contentWrapper) {
            const mainElement = contentWrapper.querySelector("main");
            if (mainElement) {
                const children = Array.from(mainElement.children);
                if (children.length >= 1) {
                    children[0].remove(); // 最初の要素を削除
                }
                if (children.length >= 2) {
                    children[1].style.width = "100%"; // 2番目の要素の幅を100%に設定
                }
                if (children.length >= 3) {
                    children[2].remove(); // 3番目の要素を削除
                }
            }
        }
    }


    function hideArticles() {
        // 記事を取得してフィルタリング
        document.querySelectorAll("#Stream article").forEach(article => {
            const titleElement = article.querySelector("h1 span");
            const providerElement = article.querySelector("cite");

            const title = titleElement ? titleElement.innerText : "";
            const provider = providerElement ? providerElement.innerText : "";

            let blocked = false;
            let blockReason = "";

            // 条件1: providerName にブロック対象のキーワードが含まれる
            if (blockProviders.some(keyword => provider.includes(keyword))) {
                reasonBlockCounts["provider"]++;
                blockReason = "provider";
                blocked = true;
            }

            // 条件2: articleTitle にブロック対象のキーワードが含まれる
            if (blockKeywords.some(keyword => title.includes(keyword))) {
                reasonBlockCounts["title"]++;
                blockReason = "title";
                blocked = true;
            }

            // ブロック対象記事への処理
            if (blocked) {
                article.style.display = "none";

                // provider ごとのブロック件数を更新
                if (provider in providerBlockCounts) {
                    providerBlockCounts[provider]++;
                } else {
                    providerBlockCounts[provider] = 1;
                }
            }
            // provider ごとの記事件数を更新
            if (provider in providerCounts) {
                providerCounts[provider]++;
            } else {
                providerCounts[provider] = 1;
            }
        });

        // 広告を削除
        const parent = document.getElementById("qurireco");
        if (parent) {
            Array.from(parent.children).forEach(child => {
                if (child.tagName.toLowerCase() !== "article") {
                    child.style.display = "none";
                }
            });
        }

        // 統計情報をログ出力
        console.log("=== ブロック統計情報 ===");
        console.log("■ Providerごとのブロック件数:", providerBlockCounts);
        console.log("■ ブロック理由ごとの件数:", reasonBlockCounts);
        console.log("配信元件数=", Object.keys(providerCounts).length)
        const sortedProviderCounts = Object.fromEntries(
            Object.entries(providerCounts).sort((a, b) => b[1] - a[1])
          );
        console.table(sortedProviderCounts);
    }
    
    hideSidebarContent();
    // 初回実行
    hideArticles();

    // 定期的に監視（Ajaxで更新される可能性があるため）
    const observer = new MutationObserver(hideArticles);
    observer.observe(document.body, { childList: true, subtree: true });

})();
