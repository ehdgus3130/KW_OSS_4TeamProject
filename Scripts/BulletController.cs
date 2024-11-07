using System.Collections;
using System.Collections.Generic;
using UnityEditor.Rendering;
using UnityEngine;

public class BulletController : MonoBehaviour
{
    public float speed;
    public int damage = 1;

    Transform player;
    Rigidbody2D rigid;
    void Start()
    {
        player = GameManager.instance.player.GetComponent<Transform>();
        rigid = GetComponent<Rigidbody2D>();
    }
    void Update()
    {
        if(!GameManager.instance.isLive) return;

        if(rigid.position.x >= 10f) gameObject.SetActive(false);
    }
    void FixedUpdate()
    {
        if (!GameManager.instance.isLive) return;

        rigid.MovePosition(rigid.position + Vector2.right * speed * Time.fixedDeltaTime);
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if(!collision.CompareTag("Enemy")) return;

        rigid.velocity = Vector2.zero;
        gameObject.SetActive(false);
    }
}
