using UnityEngine;
public class PlayerController : MonoBehaviour
{
    float speed;
    Vector2 input;
    Rigidbody2D rigid;
    void Awake()
    {
        rigid = GetComponent<Rigidbody2D>();
        speed = 7f;
    }

    // Update is called once per frame
    void Update()
    {
        if (!GameManager.instance.isLive) return;
        move();
    }
    private void move()
    {
        input.x = Input.GetAxisRaw("Horizontal");
        input.y = Input.GetAxisRaw("Vertical");
    }
    private void FixedUpdate()
    {
        if (input == Vector2.zero) return;
        Vector2 inputVec = input.normalized * speed * Time.deltaTime;
        Vector2 nextVec = rigid.position + inputVec;
        if (nextVec.x < -8f || nextVec.x > 8f || nextVec.y > 4.5f || nextVec.y < -4f) return;
        rigid.MovePosition(rigid.position + inputVec);
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (!GameManager.instance.isLive || !collision.CompareTag("Enemy")) return;

        GameManager.instance.health -= 1;

        if(GameManager.instance.health <= 0)
        {
            GameManager.instance.isLive = false;
            GameManager.instance.GameOver();
        }
    }
}
