using System.Collections;
using UnityEngine;
using UnityEngine.UI;
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
    public GameObject uiPause;
    public Result uiResult;
    public Image expGauge;

    WaitForSecondsRealtime wait;
    void Awake()
    {
        instance = this;
        wait = new WaitForSecondsRealtime(0.5f);
        expGauge.fillAmount = 0;
        WebGLInput.captureAllKeyboardInput = false;
    }
    void Update()
    {
        if (!isLive) return;
        if (maxTime <= gameTime)
        {
            StartCoroutine(GameEndRoutine());
        }
        gameTime += Time.deltaTime;
        levelUp();
        if (HUD.gameObject.activeSelf)
        {
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                PauseGame();
                uiPause.SetActive(true);
            }
        }
    }
    void levelUp()
    {
        int requiredExp = 5 * (level + 1);

        expGauge.fillAmount = (float)exp / requiredExp;
        if (exp >= requiredExp)
        {
            level++;
            exp = 0;
            player.GetWeapon().Enforce(2, 0.05f);
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
        }
    }
    public void GameStart()
    {
        isLive = true;
        health = maxHealth;
        player.gameObject.SetActive(true);
        uiStart.gameObject.SetActive(false);
        HUD.gameObject.SetActive(true);
        AudioManager.instance.PlayBgm(true);
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
    public void PauseGame()
    {
        if (isLive)
        {
            Time.timeScale = 0;
            isLive = false;
        }
    }

    public void ResumeGame()
    {
        if (!isLive)
        {
            Time.timeScale = 1;
            isLive = true;
        }
    }
}
