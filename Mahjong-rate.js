'use strict';
const calculateButton = document.getElementById('calc');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');
const scoreTable = document.getElementById('score-table');
let PLAYER_NUM = 0;
if (window.location.href.split('/').pop() === 'Mahjong-rate.html') {
    PLAYER_NUM = 4;
}else if (window.location.href.split('/').pop() === 'Mahjong-rate3.html'){
    PLAYER_NUM = 3;
}
const startPoint = 25000; // 持ち点
const returnPoint = 30000; // 返し点
// const rankBonus = Array(PLAYER_NUM);
const rankBonus = [20, 10, -10, -20]; // 順位ボーナス
const rates = Array(PLAYER_NUM);
rates.fill(0);
let count = 1;

// 引数の要素の子要素をすべて削除する関数
function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
// 降順でソートするための関数
function compareFunc(a, b) {
    return b - a;
}

// 計算ボタンを押したときの処理
calculateButton.onclick = () => {

    // TODO 一度入力した部分の計算をやり直すh
    
    // プレイヤー名を受け取る
    const userNames = [];
    for(let i = 1; i <= PLAYER_NUM; i++) {
        if (userNames[i-1] === '') { // プレイヤー名未入力で注意書きを出す
            alert('名前が未入力のプレイヤーがいます');
            return;
        }
        userNames.push(document.getElementById('user-name' + i).value);
    }

    // 半荘の点数を受け取る(文字列を数字に変換している)
    const gameScores = [];
    for(let i = 1; i <= PLAYER_NUM; i++) {
        if (document.getElementById('score' + i + '-' + count).value === '') {
            alert('点数が未入力のプレイヤーがいます');
            return;
        }
        gameScores.push(Number(document.getElementById('score' + i + '-' + count).value));
    }

    // 点数の合計が合わないときにお知らせしてくれる
    let scoreSum = 0;
    for (let i = 0; i < PLAYER_NUM; i++) {
        scoreSum += gameScores[i];
    }
    if (scoreSum !== startPoint*PLAYER_NUM) {
        alert('点数の合計が正しくありません');
        return;
    }

    // TODO 順位ボーナスを受け取る

    // 順位ボーナスの設定、振り分けをする
    const bonusScores = Array(PLAYER_NUM); // プレイヤーごとの勝ち点を格納する配列
    const gameScoresCopy = Array.from(gameScores); // 半荘の点数の配列をコピー
    gameScoresCopy.sort(compareFunc);
    for (let i = 0; i < PLAYER_NUM; i++) {
        for (let j = 0; j < PLAYER_NUM; j++) {
            if ((bonusScores[j] === undefined) && (gameScoresCopy[i] === gameScores[j])) {
                bonusScores[j] = rankBonus[i];
            }
        }
    }


    // レートの合計を計算する
    const gameRates = Array(PLAYER_NUM);
    gameRates.fill(0);
    for(let i = 0; i < PLAYER_NUM; i++) {
        gameRates[i] = (gameScores[i] - returnPoint) * 0.001 + bonusScores[i];
        rates[i] = rates[i] + gameRates[i];
    }

    // レートを結果表示エリアに表示
    removeAllChildren(resultDivided);
    for(let i = 0; i < PLAYER_NUM; i++) {
        const playerRate = document.createElement('p');
        playerRate.innerText = userNames[i] + '    ' + rates[i];
        resultDivided.appendChild(playerRate);
    }


    // 表の行を新しく追加
    const newTableRow = scoreTable.insertRow(count+1);
    count++;
    for(let i = 0; i < PLAYER_NUM; i++) {
        const newTableData = document.createElement('td');
        newTableRow.appendChild(newTableData);
        const newInput = document.createElement('input');
        const newInputId = 'score' + (i+1) + '-' + count;
        newInput.setAttribute('id', newInputId);
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('size', '20');
        newInput.setAttribute('maxlength', '6');
        newInput.setAttribute('placeholder', '点数');
        newTableData.appendChild(newInput);
    }

    // ツイートエリア
    // <a href="https://twitter.com/intent/tweet?button_hashtag=麻雀レート計算結果&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-show-count="false">Tweet #今日の麻雀</a>
    // <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    removeAllChildren(tweetDivided);
    let tweetText = userNames[0] + 'さんのレートは' + rates[0].toFixed(1) + '\n'
                    + userNames[1] + 'さんのレートは' + rates[1].toFixed(1) + '\n'
                    + userNames[2] + 'さんのレートは' + rates[2].toFixed(1) + '\n'

    if (PLAYER_NUM === 4) {
        tweetText += userNames[3] + 'さんのレートは' + rates[3].toFixed(1) + ' でした。' + '\n';
    }
    const anchor = document.createElement('a');
    const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag='
        + encodeURIComponent('今日の麻雀')
        + '&ref_src=twsrc%5Etfw';
    anchor.setAttribute('href', hrefValue);
    // ↓anchor.className = 'twitter-hashtag-button'と同一;
    anchor.setAttribute('class', 'twitter-hashtag-button');
    anchor.setAttribute('data-text', tweetText);
    anchor.setAttribute('data-show-count', 'false');
    anchor.innerText = 'Tweet #今日の麻雀';
    tweetDivided.appendChild(anchor);

    // widgets.js 
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);
};