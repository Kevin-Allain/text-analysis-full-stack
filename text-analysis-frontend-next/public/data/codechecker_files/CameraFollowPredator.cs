using UnityEngine;
using System.Collections;

public class CameraFollowPredator : MonoBehaviour {

	public GameObject toFollow;
	public float catchupSpeed=0.1f;
	public Vector3 deltaFollow = new Vector3(0,10,-10);
	// Use this for initialization
	void Start () {
		toFollow = GameObject.FindGameObjectWithTag ("Predator");
	}
	
	// Update is called once per frame
	void Update () {
		Vector3 distanceVec = toFollow.transform.position-this.transform.position+deltaFollow;
		this.transform.position += distanceVec*catchupSpeed;

		this.transform.LookAt (toFollow.transform.position, Vector3.up);
	}
}
