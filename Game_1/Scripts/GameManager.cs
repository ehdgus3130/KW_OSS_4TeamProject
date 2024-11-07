using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [Header("# Game Control")]
    public bool isLive;
    public float gameTime;
    [Header("# Player Info")]
    public int maxHealth = 5;
    public int health;
    [Header("# Game object")]
    public PoolManager pool;
    public PlayerController player;
    public GameObject uiStart;
    public Result uiResult;
    public Heart uiHeart;

    WaitForSecondsRealtime wait;
    void Awake()
    {
        instance = this;
        wait = new WaitForSecondsRealtime(0.5f);
    }
    void Update()
    {
        if (!isLive) return;

        gameTime += Time.deltaTime;
    }
    public void GameStart()
    {
        isLive = true;
        health = maxHealth;
        player.gameObject.SetActive(true);
        uiHeart.gameObject.SetActive(true);
        uiStart.gameObject.SetActive(false);
        Time.timeScale = 1;
    }
    public void GameOver()
    {
        StartCoroutine(GameOverRoutine());
    }
    IEnumerator GameOverRoutine()
    {
        isLive = false;
        Time.timeScale = 0;
        yield return wait;
        uiHeart.gameObject.gameObject.SetActive(false);
        uiResult.gameObject.SetActive(true);
        uiResult.Win();
    }
    public void GameRetry()
    {
        SceneManager.LoadScene(0);
    }
}
