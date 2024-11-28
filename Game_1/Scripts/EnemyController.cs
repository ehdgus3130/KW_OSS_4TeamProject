using UnityEngine;

public class EnemyController : MonoBehaviour
{
    [Header("Enemy Info")]
    public int health;
    public float speed;
    public int damage = 1;

    bool isLive;

    Rigidbody2D rigid;
    SpriteRenderer spriteRenderer;

    void Start()
    {
        rigid = GetComponent<Rigidbody2D>();
        spriteRenderer = GetComponent<SpriteRenderer>();
    }
    public void Init(SpawnData data)
    {
        health = data.maxHealth;
        speed = data.speed;
    }
    void Update()
    {
        if (!GameManager.instance.isLive) return;
        if(rigid.position.x < -10f)
        {
            gameObject.SetActive(false);
        }
    }
    void FixedUpdate()
    {
        if (!GameManager.instance.isLive) return;
        rigid.MovePosition(rigid.position + Vector2.left * speed * Time.fixedDeltaTime);
    }
    void OnEnable()
    {
        isLive = true;
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (!isLive) return;

        if(collision.CompareTag("Bullet") || collision.CompareTag("Skill"))
        {
            BulletController bullet = collision.GetComponent<BulletController>();

            AudioManager.instance.PlaySfx(AudioManager.Sfx.Hit);
            health -= bullet.getDamage();

            if (health <= 0)
            {
                isLive = false;
                gameObject.SetActive(false);
                createItem();
                GameManager.instance.score++;
                GameManager.instance.exp++;
            }
        }
    }
    void createItem()
    {
        int type = Random.Range(2, 4);
        int chance = Random.Range(0, 100);

        if (chance < 10)
        {
            Transform item = GameManager.instance.pool.Get(type).transform;
            item.position = transform.position;
        }
    }
}
