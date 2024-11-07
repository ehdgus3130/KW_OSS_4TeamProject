using System.Collections.Generic;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public Transform[] spawnPoint;

    float timer = 0f;
    float spawnTime = 2f;
    void Awake()
    {
        spawnPoint = GetComponentsInChildren<Transform>();
    }
    void Update()
    {
        if (!GameManager.instance.isLive) return;

        timer += Time.deltaTime;
        if(timer >= spawnTime)
        {
            spawn();
            timer = 0f;
        }
    }
    void spawn()
    {
        List<int> usedIndexes = new List<int>();

        for (int i = 0; i < 4; i++)
        {
            int randomIndex;

            do
            {
                randomIndex = Random.Range(1, spawnPoint.Length);
            } while (usedIndexes.Contains(randomIndex));

            usedIndexes.Add(randomIndex);

            GameObject enemy = GameManager.instance.pool.Get(0);
            enemy.transform.position = spawnPoint[randomIndex].position;
        }
    }
}
