using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Result : MonoBehaviour
{
    [System.Serializable] // �ν����Ϳ� ǥ�õǵ��� Serializable �߰�
    public class TextGroup
    {
        public Text curScore; // ���� ���� �ؽ�Ʈ
        public Text highScore;   // �ְ� ���� �ؽ�Ʈ
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