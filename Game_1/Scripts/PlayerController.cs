using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class PlayerController : MonoBehaviour
{
    public float speed;
    public Image[] cooldownImage;

    bool hit = false;
    float coolTime = 15f;
    float cooldownTime;

    float hitDelay = 1f;
    float blinkInterval = 0.1f;

    Vector2 input;
    Rigidbody2D rigid;
    SpriteRenderer spriteRenderer;
    WaitForSeconds wait;
    Coroutine[] coolCoroutine;

    Weapon weapon;
    void Awake()
    {
        wait = new WaitForSeconds(blinkInterval);
        rigid = GetComponent<Rigidbody2D>();
        spriteRenderer = GetComponent<SpriteRenderer>();
        weapon = GetComponentInChildren<Weapon>();
        coolCoroutine = new Coroutine[3];
        foreach (Image image in cooldownImage)
        {
            image.fillAmount = 0f;
        }
        cooldownTime = coolTime;
    }
    void Update()
    {
        if (!GameManager.instance.isLive) return;
        
        cooldownTime += Time.deltaTime;
        levelUp(); 
        move();
        skill();
    }
    void move()
    {
        input = Vector2.zero;

        if (Input.GetKey(KeyCode.W))
            input.y = 1;
        else if (Input.GetKey(KeyCode.S))
            input.y = -1;

        if (Input.GetKey(KeyCode.A))
            input.x = -1;
        else if (Input.GetKey(KeyCode.D))
            input.x = 1;
        }
    void skill()
    {
        if (Input.GetKeyDown(KeyCode.K) && cooldownTime >= coolTime)
        {
            StartCoroutine(CooldownCoroutine(0, coolTime));
            Transform bullet = GameManager.instance.pool.Get(1).transform;
            int damage = GetComponentInChildren<Weapon>().damage;
            bullet.parent = weapon.transform;
            bullet.gameObject.tag = "Skill";
            bullet.transform.localScale = new Vector3(13, 13, 13);

            bullet.GetComponent<BulletController>().Init(damage + damage / 2);
            bullet.position = transform.position;
            bullet.parent = transform;

            cooldownTime = 0f;
        }
    }
    void levelUp()
    {
        if (GameManager.instance.exp >= 5 * (GameManager.instance.level + 1))
        {
            GameManager.instance.level++;
            GameManager.instance.exp = 0;
            weapon.Enforce(2, 0.05f);
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
        }
    }
    void FixedUpdate()
    {
        if (!GameManager.instance.isLive || input == Vector2.zero) return;
        
        Vector2 inputVec = input.normalized * speed * Time.deltaTime;
        Vector2 nextVec = rigid.position + inputVec;

        if (nextVec.x < -8f || nextVec.x > 8f || nextVec.y > 4.5f || nextVec.y < -4f) return;

        rigid.MovePosition(nextVec);
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (!GameManager.instance.isLive || hit) return;

        if (collision.CompareTag("Enemy"))
        {
            AudioManager.instance.PlaySfx(AudioManager.Sfx.Hit_P);
            hit = true;
            GameManager.instance.health -= 1;

            if (GameManager.instance.health <= 0)
            {
                GameManager.instance.isLive = false;
                GameManager.instance.GameOver();
            }
            else StartCoroutine(HitRoutine());
        }
    }
    IEnumerator HitRoutine()
    {
        float elapsed = 0f;

        while (elapsed < hitDelay)
        {
            spriteRenderer.enabled = !spriteRenderer.enabled;
            yield return wait;
            elapsed += blinkInterval;
        }

        spriteRenderer.enabled = true;
        hit = false;
    }
    public void StartCooldown(int type, float _coolTime)
    {
        if(coolCoroutine[type + 1] != null)
        {
            StopCoroutine(coolCoroutine[type + 1]);
        }
        coolCoroutine[type + 1] = StartCoroutine(CooldownCoroutine(type + 1, _coolTime));
    }
    public IEnumerator CooldownCoroutine(int type, float _coolTime)
    {
        cooldownImage[type].fillAmount = 1f;

        float elapsedTime = 0f;

        while (elapsedTime < _coolTime)
        {
            elapsedTime += Time.deltaTime;
            cooldownImage[type].fillAmount = 1f - (elapsedTime / _coolTime);
            yield return null;
        }

        cooldownImage[type].fillAmount = 0f;
    }
}
