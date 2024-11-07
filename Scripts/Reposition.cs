using UnityEngine;

public class Reposition : MonoBehaviour
{
    float scrollSpeed = 2f;

    Transform tr;
    Vector3 startPos;
    void Start()
    {
        tr = GetComponent<Transform>();
        startPos = tr.position;
    }

    void Update()
    {
        tr.position += Vector3.left * scrollSpeed * Time.deltaTime;
        if(tr.position.x <= -17.8f)
        {
            startPos.x = 17.8f;
            tr.position = startPos;
        }
    }
}
