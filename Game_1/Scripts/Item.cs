using UnityEngine;

public class Item : MonoBehaviour
{
    public enum Type { Gem, Cherry }
    public Type type;

    public float speed;

    Rigidbody2D rigid;
    Weapon waapon;
    void Awake()
    {
        rigid = GetComponent<Rigidbody2D>();
    }
    void FixedUpdate()
    {
        rigid.MovePosition(rigid.position + Vector2.left * speed * Time.fixedDeltaTime);
    }
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (!collision.CompareTag("Player")) return;

        PlayerController player = collision.GetComponent<PlayerController>();
        waapon = player.GetComponentInChildren<Weapon>();

        AudioManager.instance.PlaySfx(AudioManager.Sfx.Item);

        switch (type)
        {
            case Type.Gem:
                waapon.ApplyBuff((int)Type.Gem);
                player.StartCooldown((int)Type.Gem, waapon.buffTime);
                break;
            case Type.Cherry:
                waapon.ApplyBuff((int)Type.Cherry);
                player.StartCooldown((int)Type.Cherry, waapon.buffTime);
                break;
        }

        rigid.velocity = Vector2.zero;
        gameObject.SetActive(false);
    }
}
