using UnityEngine;
using System.Collections;



public class PredatorMovement : MonoBehaviour {



	CharacterController charControl;

	public float RunningSpeed;
	public float MoveSpeed;
	public float CrouchSpeed;
	public float RotateSpeed;


	public bool isCrouched;
	public bool isRunning;

	// Use this for initialization
	void Start () {
		charControl = GetComponent<CharacterController>();
			isCrouched=false;
			isRunning = false;
	}
	
	// Update is called once per frame
	void Update () {
		float horiz = Input.GetAxis ("Horizontal");
		float vertic = Input.GetAxis ("Vertical");
		Vector3 toMove= this.transform.forward * vertic;


		if (Input.GetAxis ("Jump") != 0) {
			//print("isCrouched");
			toMove= toMove.normalized* CrouchSpeed;			// crouched
			isCrouched=true;
		} else if (Input.GetAxis("Run") !=0) {
			//print("isRunning");
			toMove= toMove.normalized* RunningSpeed;			// crouched
			isRunning=true;
			isCrouched=false;
		}
		else {
			toMove=toMove.normalized * MoveSpeed;
			isCrouched=false;
			isRunning=false;
		}



		if (vertic>=0.0f)
			charControl.SimpleMove (toMove);

		//print ("leopard toMove: "+toMove);

		if (isCrouched ) {
			animation.Play ("Leopard_sneak");
		} else if (isRunning && toMove.magnitude>0) {
						animation.Play ("Leopard_run");		
		} else if(toMove.magnitude>5.0f) {
			animation.Play("Leopard_walk");
		} else {
		
		}

		this.transform.Rotate(0,horiz*RotateSpeed,0);
	}
}
