using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Result : MonoBehaviour
{
    [System.Serializable] // 인스펙터에 표시되도록 Serializable 추가
    public class TextGroup
    {
        public Text curScore; // 현재 점수 텍스트
        public Text highScore;   // 최고 점수 텍스트
    }

    public List<TextGroup> textGroups = new List<TextGroup>();
    public GameObject winTitle;
    public GameObject loseTitle;
    public void Lose()
    {
        ShowResult(false);
    }

    public void Win()
    {
        ShowResult(true);
    }

    void ShowResult(bool isWin)
    {
        winTitle.SetActive(isWin);
        loseTitle.SetActive(!isWin);

        int currentScore = GameManager.instance.score;
        int highScore = PlayerPrefs.GetInt("HighScore", 0);

        if (currentScore > highScore)
        {
            highScore = currentScore;
            PlayerPrefs.SetInt("HighScore", highScore);
        }

        if (isWin)
        {
            textGroups[1].curScore.text = $"Score : {currentScore}"; // WinCurrentScore
            textGroups[1].highScore.text = $"High Score : {highScore}"; // WinHighScore
        }
        else
        {
            textGroups[0].curScore.text = $"Score : {currentScore}"; // LoseCurrentScore
            textGroups[0].highScore.text = $"High Score : {highScore}"; // LoseHighScore
        }
    }
}