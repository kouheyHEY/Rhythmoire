# 音楽ゲーム（Rhythmoire）

## 譜面形式
譜面はjsonファイルで保持する
1小節を96分割して、0~95の整数でノーツの位置を記録する

例：
{  
    bpm: 145,  
    name: TestSong,  
    highScore: 961000,
    Rank: A,
    Lane1:  {
        [0, 24],
        [0, 48],
        [0, 72],
        [0, 96],
    },
    Lane2:  {

    },
    ...

}  