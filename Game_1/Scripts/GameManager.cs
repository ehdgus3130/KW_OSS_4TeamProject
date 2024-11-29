using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine.EventSystems;

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

    [Header("# UI Elements")]
    public GameObject HUD;
    public GameObject uiStart;
    public GameObject uiPause;
    public GameObject uiHelp;
    public Result uiResult;
    public Image expGauge;

    [Header("# Buttons")]
    public Button startButton;
    public Button helpButton;

    [Header("# Button Texts")]
    public Text startButtonText;
    public Text helpButtonText;

    public Color normalColor = Color.black;
    public Color highlightedColor = Color.green;

    EventSystem eventSystem;
    WaitForSecondsRealtime wait;
    void Awake()
    {
        instance = this;
        wait = new WaitForSecondsRealtime(0.5f);
        expGauge.fillAmount = 0;
        WebGLInput.captureAllKeyboardInput = false;
        LoadHighScore();
        eventSystem = EventSystem.current;
    }
    void Start()
    {
        SelectButton(startButton);
    }
    void Update()
    {
        HandleMenuInput();
        if (uiPause.activeSelf) HandlePauseInput();
        if (!isLive) return;

        HandleGameplay();
    }
    void LevelUp()
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
        SaveHighScore();
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
        SceneManager.LoadScene(0);
    }
    public void PauseGame()
    {
        if (isLive)
        {
            isLive = false;
            HUD.gameObject.SetActive(false);
            Time.timeScale = 0;
        }
    }
    public void ResumeGame()
    {
        if (!isLive)
        {
            isLive = true;
            HUD.gameObject.SetActive(true);
            Time.timeScale = 1;
        }
    }
    void SaveHighScore()
    {
        int highScore = PlayerPrefs.GetInt("HighScore", 0);
        if (score > highScore)
        {
            PlayerPrefs.SetInt("HighScore", score);
        }
    }
    void LoadHighScore()
    {
        int highScore = PlayerPrefs.GetInt("HighScore", 0);
    }
    void HandleMenuInput()
    {
        if (uiStart.activeSelf)
        {
            HandleButtonNavigation();

            if (Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.Space))
            {
                eventSystem.currentSelectedGameObject?.GetComponent<Button>()?.onClick.Invoke();
            }

            UpdateButtonColors();
            if (eventSystem.currentSelectedGameObject == null && Input.anyKeyDown)
            {
                SelectButton(startButton);
            }
        }
        else if (uiHelp.activeSelf && Input.GetKeyDown(KeyCode.Escape))
        {
            uiStart.SetActive(true);
            uiHelp.SetActive(false);

            SelectButton(startButton);
        }
    }
    void HandlePauseInput()
    {
        if (Input.GetKeyDown(KeyCode.Y)) GameRetry();
        else if (Input.GetKeyDown(KeyCode.N))
        {
            ResumeGame();
            uiPause.SetActive(false);
        }
    }
    void HandleGameplay()
    {
        if (maxTime <= gameTime)
        {
            StartCoroutine(GameEndRoutine());
            return;
        }

        gameTime += Time.deltaTime;
        LevelUp();

        if (HUD.activeSelf && Input.GetKeyDown(KeyCode.Escape))
        {
            PauseGame();
            uiPause.SetActive(true);
        }
    }
    void HandleButtonNavigation()
    {
        eventSystem.sendNavigationEvents = false;

        if (Input.GetKeyDown(KeyCode.W))
        {
            if (eventSystem.currentSelectedGameObject == helpButton.gameObject)
            {
                SelectButton(startButton);
            }
        }
        else if (Input.GetKeyDown(KeyCode.S))
        {
            if (eventSystem.currentSelectedGameObject == startButton.gameObject)
            {
                SelectButton(helpButton);
            }
        }
    }
    void SelectButton(Button button)
    {
        eventSystem.SetSelectedGameObject(button.gameObject);
    }
    void UpdateButtonColors()
    {
        if (eventSystem.currentSelectedGameObject == startButton.gameObject)
        {
            startButtonText.color = highlightedColor;
            helpButtonText.color = normalColor;
        }
        else if (eventSystem.currentSelectedGameObject == helpButton.gameObject)
        {
            startButtonText.color = normalColor;
            helpButtonText.color = highlightedColor;
        }
        else
        {
            startButtonText.color = normalColor;
            helpButtonText.color = normalColor;
        }
    }
}