using UnityEngine;

public class BulletController : MonoBehaviour
{
    [SerializeField]
    float speed = 10f;
    [SerializeField]
    int damage;

    Transform player;
    Rigidbody2D rigid;
    void Awake()
    {
        player = GameManager.instance.player.GetComponent<Transform>();
        rigid = GetComponent<Rigidbody2D>();
    }
    public void Init(int _damage)
    {
        damage = _damage;
    }
    void Update()
    {
        if(!GameManager.instance.isLive) return;

        if (rigid.position.x >= 15f)
        {
            if(gameObject.tag == "Skill")
            {
                gameObject.tag = "Bullet";
                gameObject.transform.localScale = new Vector3(0.5f, 0.5f, 0.5f);
            }
            gameObject.SetActive(false);
        }
    }
    void FixedUpdate()
    {
        if (!GameManager.instance.isLive) return;

        rigid.MovePosition(rigid.position + Vector2.right * speed * Time.fixedDeltaTime);
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (gameObject.tag == "Skill") return;
        if(!collision.CompareTag("Enemy")) return;
        
        rigid.velocity = Vector2.zero;
        gameObject.SetActive(false);
    }
    public int getDamage()
    {
        return damage;
    }
}
