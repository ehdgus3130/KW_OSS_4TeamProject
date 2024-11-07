using System.Runtime.InteropServices.WindowsRuntime;
using UnityEngine;
using UnityEngine.UIElements;

public class Weapon : MonoBehaviour
{
    float delayTime = 0.5f;

    float timer = 0f;
    Rigidbody2D rigid;
    void Awake()
    {
        rigid = GetComponent<Rigidbody2D>();
    }
    void Update()
    {
        if (!GameManager.instance.isLive) return;

        timer += Time.deltaTime;
        if(timer >= delayTime)
        {
            Fire();
            timer = 0f;
        }
    }
    void Fire()
    {
        Transform bullet = GameManager.instance.pool.Get(1).transform;
        bullet.position = transform.position;
        bullet.parent = transform;
    }
}
