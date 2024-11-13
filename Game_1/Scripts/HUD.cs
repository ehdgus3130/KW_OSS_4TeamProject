using UnityEngine;
using UnityEngine.UI;

public class HUD : MonoBehaviour
{
    public enum InfoType { Time, Score }
    public InfoType type;

    Text myText;

    void Awake()
    {
        myText = GetComponent<Text>();
    }
    void LateUpdate()
    {
        switch (type)
        {
            case InfoType.Time:
                float remainTime = GameManager.instance.gameTime;
                int min = Mathf.FloorToInt(remainTime / 60);
                int sec = Mathf.FloorToInt(remainTime % 60);
                myText.text = string.Format("{0:D2}:{1:D2}", min, sec);
                break;
            case InfoType.Score:
                myText.text = string.Format("Score: {0:F0}", GameManager.instance.score);
                break;
        }
    }
}
