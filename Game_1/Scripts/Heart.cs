using UnityEngine;

public class Heart : MonoBehaviour
{
    int health;
    public GameObject[] hearts;

    void Awake()
    {
        health = GameManager.instance.health;
    }
    void Update()
    {
        if (!GameManager.instance.isLive) return;
        if(health != GameManager.instance.health)
        {
            hearts[--health].SetActive(false);
        }
    }
}
