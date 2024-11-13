using UnityEngine;
using System.Collections;

public class Weapon : MonoBehaviour
{
    public int baseDamage = 2;
    public int damage = 2;
    public float baseFireTime = 0.5f;
    public float fireTime = 0.5f;

    int itemCnt = 2;
    float timer = 0f;
    public float buffTime = 10f;
    float[] bufferTimer;

    Rigidbody2D rigid;
    WaitForSeconds wait;
    WaitForSeconds baseWait;
    Coroutine[] buffCoroutine;
    void Awake()
    {
        rigid = GetComponent<Rigidbody2D>();
        baseWait = wait = new WaitForSeconds(buffTime);
        buffCoroutine = new Coroutine[itemCnt];
        bufferTimer = new float[itemCnt];
        damage = baseDamage;
    }
    void Update()
    {
        if (!GameManager.instance.isLive) return;

        timer += Time.deltaTime;
        if(timer >= fireTime)
        {
            Fire();
            timer = 0f;
        }
    }
    public void Enforce(int rangeD, float rangeT)
    {
        baseDamage += rangeD;
        damage = baseDamage;

        baseFireTime = Mathf.Max(0.2f, baseFireTime - rangeT);
        fireTime = baseFireTime;

        for (int index = 0; index < itemCnt; index++)
        {
            if (buffCoroutine[index] != null)
            {
                StopCoroutine(buffCoroutine[index]);
                float time = buffTime - bufferTimer[index];
                Debug.Log(time);
                wait = new WaitForSeconds(time);
                buffCoroutine[index] = StartCoroutine(Buff(index, time));
            }
        }
    }
    void Fire()
    {
        Transform bullet = GameManager.instance.pool.Get(1).transform;
        bullet.GetComponent<BulletController>().Init(damage);
        bullet.position = transform.position;
        bullet.parent = transform;
    }
    public void ApplyBuff(int type)
    {
        if (buffCoroutine[type] != null) StopCoroutine(buffCoroutine[type]);
        buffCoroutine[type] = StartCoroutine(Buff(type, buffTime));
    }
    IEnumerator Buff(int type, float duration)
    {
        float elapsedTime = 0f;
        bufferTimer[type] = 0f;
        if (type == 0)
        {
            damage = baseDamage * 2;
        }
        else if(type == 1)
        {
            fireTime = baseFireTime / 2;
        }
        while (elapsedTime < duration)
        {
            elapsedTime += Time.deltaTime;
            bufferTimer[type] = elapsedTime;  // 흘러간 시간 저장
            yield return null;
        }
        if (type == 0)
        {
            damage /= 2;
        }
        else if(type == 1)
        {
            fireTime *= 2;
        }

        wait = baseWait;
        bufferTimer[type] = 0f;

        buffCoroutine[type] = null;
    }
}
