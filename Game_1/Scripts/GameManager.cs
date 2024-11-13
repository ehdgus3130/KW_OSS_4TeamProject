using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [Header("# Game Control")]
    public bool isLive;
    public float maxTime;
    public float gameTime;
    public int score;
    [Header("# Player Info")]
    public int level = 0;
    public int exp = 0;
    public int maxHealth = 5;
    public int health;
    [Header("# Game object")]
    public PoolManager pool;
    public PlayerController player;
    public GameObject uiStart;
    public GameObject HUD;
    public Result uiResult;

    WaitForSecondsRealtime wait;
    void Awake()
    {
        instance = this;
        wait = new WaitForSecondsRealtime(0.5f);
        AudioManager.instance.PlayBgm(true);
    }
    void Update()
    {
        if (!isLive) return;
        if(maxTime <= gameTime)
        {
            StartCoroutine(GameEndRoutine());
        }
        gameTime += Time.deltaTime;
    }
    public void GameStart()
    {
        isLive = true;
        health = maxHealth;
        player.gameObject.SetActive(true);
        uiStart.gameObject.SetActive(false);
        HUD.gameObject.SetActive(true);
        Time.timeScale = 1;
    }
    public void GameOver()
    {
        StartCoroutine(GameEndRoutine());
    }
    IEnumerator GameEndRoutine()
    {
        isLive = false;
        Time.timeScale = 0;
        yield return wait;
        HUD.gameObject.SetActive(false);
        uiResult.gameObject.SetActive(true);

        AudioManager.instance.PlayBgm(false);

        if (health > 0)
        {
            uiResult.Win();
            AudioManager.instance.PlaySfx(AudioManager.Sfx.Win);
        }
        else
        {
            uiResult.Lose();
            AudioManager.instance.PlaySfx(AudioManager.Sfx.Lose);
        }
    }
    public void GameRetry()
    {
        Time.timeScale = 1;
        SceneManager.LoadScene(0);
    }
}
