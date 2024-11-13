using UnityEngine;
using UnityEngine.UI;

public class Result : MonoBehaviour
{
    public Text[] text;
    public GameObject[] titles;

    public void Lose()
    {
        titles[0].SetActive(true);
        text[0].text = "Score : " + GameManager.instance.score;
    }
    public void Win()
    {
        titles[1].SetActive(true);
        text[1].text = "Score : " + GameManager.instance.score;
    }
}