using UnityEngine;

public class EnemyController : MonoBehaviour
{
    [Header("Enemy Info")]
    public int health;
    public float speed;
    public int damage;

    bool isLive;
    int maxHealth = 3;

    Rigidbody2D rigid;

    void Start()
    {
        rigid = GetComponent<Rigidbody2D>();
    }
    void Update()
    {
        if(rigid.position.x < -10f)
        {
            gameObject.SetActive(false);
        }
    }
    void FixedUpdate()
    {
        rigid.MovePosition(rigid.position + Vector2.left * speed * Time.fixedDeltaTime);
    }
    void OnEnable()
    {
        if (GameManager.instance.gameTime % 60 == 0) maxHealth++;
        isLive = true;
        health = maxHealth;
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (!collision.CompareTag("Bullet") || !isLive) return;

        BulletController bullet = collision.GetComponent<BulletController>();

        health -= bullet.damage;

        if (health <= 0)
        {
            isLive = false;
            gameObject.SetActive(false);
        }
    }
}
