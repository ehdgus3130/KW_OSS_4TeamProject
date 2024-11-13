using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnManager : MonoBehaviour
{
    public GameObject []obstaclePrefab;
    private Vector3 spawnPos = new Vector3(25, 0, 0);
    private Vector3 spawnPos2 = new Vector3(25, 6, 0);
    private PlayerController playerController;

    private float startDelay = 2;
    private float repeatRate = 2;

    void Start()
    {
        InvokeRepeating("SpawnObstacle", startDelay, repeatRate);
        playerController = GameObject.Find("Player").GetComponent<PlayerController>();
    }

    void SpawnObstacle()
    {
        if(playerController.gameOver == false)
        {
            int pos = Random.Range(0, 2);
            int idx = Random.Range(0, obstaclePrefab.Length);
            if (pos == 1)
            {
                Instantiate(obstaclePrefab[idx], spawnPos, obstaclePrefab[idx].transform.rotation);
            }
            else
            {
                Instantiate(obstaclePrefab[1], spawnPos2, obstaclePrefab[1].transform.rotation);
            }


        }
    }
    // Update is called once per frame
    void Update()
    {
        
    }
}
