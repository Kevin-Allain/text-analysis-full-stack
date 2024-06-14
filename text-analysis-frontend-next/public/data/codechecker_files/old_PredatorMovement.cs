using UnityEngine;
using System.Collections;

public class old_PredatorMovement : MonoBehaviour {

	CharacterController charControl;

	public float MoveSpeed;
	public float RotateSpeed;

	// Use this for initialization
	void Start () {
		charControl = GetComponent<CharacterController>();
	}
	
	// Update is called once per frame
	void Update () {
		float horiz = Input.GetAxis ("Horizontal");
		float vertic = Input.GetAxis ("Vertical");
		charControl.SimpleMove(this.transform.up*vertic* MoveSpeed);
		this.transform.Rotate(0,0,-horiz*RotateSpeed);
	}
}
