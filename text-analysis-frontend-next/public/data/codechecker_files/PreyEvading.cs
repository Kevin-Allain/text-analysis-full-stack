using UnityEngine;
using System.Collections;
using System.Collections.Generic;

/**
 * By Jb DOYON
 * Theoretical help at http://www.kfish.org/boids/pseudocode.html
 */
public class PreyEvading : MonoBehaviour
{

	/*
	public AudioSource sound;
	sound = (AudioSource)GameObject.AddComponent("AudioSource");
	AudioClip roar;
	roar = (AudioClip)Resources.Load("leopard4.mp3");
	*/
	public AudioClip roar;


		// Use this for initialization
		public CharacterController charControl;
		public GameObject predatorToEvade;
		public float EvadingSpeed;
		public float headingSpeed;
		public float alignmentCoefficient;
		public float TooCloseRadius;
		public float PredatorDistance;
		public float CrouchDetectionDistance;
		public float LocalFlockRadius;
		public float RepulsionCoefficient = 0.01f;
		public float StaminaUseThreshold;
		public float stamina;
		Vector3 CenterMass;
		Vector3 AvgLocalSpeed;
		Vector3 AvgLocalHeading;
		public Vector3 toApply;
		Vector3 heading;
	bool isEvading;


		void Start ()
		{
				predatorToEvade = GameObject.FindGameObjectWithTag ("Predator");
				charControl = GetComponent<CharacterController> ();
				heading = RandomHeading (headingSpeed);
				toApply = heading.normalized * headingSpeed;
				stamina = 1f;
		isEvading = false;
		}
	
		// Update is called once per frame
		void Update ()
		{
				//AvoidEdges ();
				//MoveTowardsLocalCenter ();
				Separation ();
				AvoidLoneliness (); 
				//MoveTowardsCenter ();
				//MatchLocalVelocity ();
				MatchLocalAlignment ();
				//MatchAlignment ();
				EvadePredator ();
				SlowDownNotChasing ();

				toApply.y = 0;
				if (toApply.magnitude > EvadingSpeed) {
						toApply = toApply.normalized * EvadingSpeed;
				}
		staminaUpdate ();

				charControl.SimpleMove (toApply);
				this.transform.forward = toApply.normalized;
		}

		void EvadePredator ()
		{


				Vector3 vectorToPredator = predatorToEvade.transform.position - this.transform.position;
				PredatorMovement other = (PredatorMovement)predatorToEvade.GetComponent ("PredatorMovement");
				float checkDistance = (other.isCrouched) ? CrouchDetectionDistance : PredatorDistance;
				if (vectorToPredator.magnitude < checkDistance) { // closing in the prey

			if(vectorToPredator.magnitude<5)
			{	print ("STOP !");
				// SOUND: play the leopard roar when you win
				AudioSource.PlayClipAtPoint(roar,predatorToEvade.transform.position);

				Time.timeScale = 0;
				return;
			}
						isEvading = true;
						float coeffEvasion = EvadingSpeed / vectorToPredator.magnitude;
						toApply -= vectorToPredator.normalized * coeffEvasion;
				} else {
			isEvading=false;
				}
		}

		/**
	 * Make sure I have my space
	 */
		void Separation ()
		{
				int layerMask = 1 << 9; // Prey Layer
				Collider[] TooClose = Physics.OverlapSphere (this.transform.position, TooCloseRadius, layerMask);
				for (int i=0; i<TooClose.Length; i++) {
						PreyEvading other = (PreyEvading)TooClose [i].GetComponent ("PreyEvading");
						Vector3 directionToClose = this.transform.position - other.transform.position;
						if (directionToClose.magnitude != 0) {
								float F = (TooCloseRadius / directionToClose.magnitude - 1.0f) * RepulsionCoefficient;
								directionToClose = directionToClose.normalized * F;
				
								//other.toApply -= directionToClose;
								toApply += directionToClose;

						}
				}
		}




		/**
	 * Catch up !
	*/
		void AvoidLoneliness ()
		{
				int layerMask = 1 << 9; // Prey Layer
				Collider[] others = Physics.OverlapSphere (this.transform.position, LocalFlockRadius, layerMask);
				bool[] isClose = new bool[others.Length]; 
				bool isAlone = true;
				for (int i=0; i<others.Length; i++) {
						PreyEvading other = (PreyEvading)others [i].GetComponent ("PreyEvading");
						Vector3 directionToClose = this.transform.position - other.transform.position;
						if (directionToClose.magnitude < LocalFlockRadius && directionToClose.magnitude != 0) {
								isAlone = false;
								isClose [i] = true;
						} else {
								isClose [i] = false;
						}
				}
				// we know if lonely
				if (isAlone) {
						MoveTowardsCenter ();
				}
		}

		void AvoidEdges ()
		{
				if (this.transform.position.x > 480) {
						toApply.x += 100;
				} else if (this.transform.position.x < -480) {
						toApply.x -= 100;
				}
				
				if (this.transform.position.z > 480) {
						toApply.z += 100;
				} else if (this.transform.position.z < -480) {
						toApply.z -= 100;
				}
		}
		
		void MoveTowardsCenter ()
		{
				GameObject[] allPreys = GameObject.FindGameObjectsWithTag ("Preys");
				Vector3 average = Vector3.zero;
				for (int i=0; i<allPreys.Length; i++) {
						PreyEvading other = (PreyEvading)allPreys [i].GetComponent ("PreyEvading");
						
						Vector3 direction = this.transform.position - other.transform.position;
						if (direction.magnitude > 0) {
								average += direction;
						}
				}
				CenterMass = average / (allPreys.Length - 1);
				toApply -= CenterMass.normalized * headingSpeed;
		}


		/**
	 * Catch up when I'm alone
	 */
		void MoveTowardsLocalCenter ()
		{
				int layerMask = 1 << 9; // Prey Layer
				Collider[] LocalFlock = Physics.OverlapSphere (this.transform.position, LocalFlockRadius, layerMask);

				Vector3 average = Vector3.zero;
				for (int i=0; i<LocalFlock.Length; i++) {
						PreyEvading other = (PreyEvading)LocalFlock [i].gameObject.GetComponent ("PreyEvading");
			
						Vector3 direction = this.transform.position - other.transform.position;
						if (direction.magnitude > 0) {
								average += direction;
						}
				}
				Vector3 LocalCenterMass = average / (LocalFlock.Length - 1);
				toApply -= LocalCenterMass.normalized * headingSpeed;
		}

		void MatchVelocity ()
		{

				GameObject[] allPreys = GameObject.FindGameObjectsWithTag ("Preys");
				Vector3 average = Vector3.zero;
				for (int i=0; i<allPreys.Length; i++) {
						PreyEvading other = (PreyEvading)allPreys [i].GetComponent ("PreyEvading");
			
						Vector3 direction = this.transform.position - other.transform.position;
						if (direction.magnitude > 0) {
								average += other.charControl.velocity;
						}
				}
				AvgLocalSpeed = average / (allPreys.Length - 1);
				toApply += (charControl.velocity - AvgLocalSpeed) / 8; 
		}

		void MatchLocalVelocity ()
		{
				int layerMask = 1 << 9; // Prey Layer
				Collider[] LocalFlock = Physics.OverlapSphere (this.transform.position, LocalFlockRadius, layerMask);
				Vector3 average = Vector3.zero;
				for (int i=0; i<LocalFlock.Length; i++) {
						PreyEvading other = (PreyEvading)LocalFlock [i].GetComponent ("PreyEvading");
			
						Vector3 direction = this.transform.position - other.transform.position;
						if (direction.magnitude > 0) {
								average += other.charControl.velocity;
						}
				}
				AvgLocalSpeed = average / (LocalFlock.Length - 1);

		float coeffHeadingCorrection = Vector3.Angle (charControl.velocity, AvgLocalSpeed) / alignmentCoefficient; 
		heading = Quaternion.AngleAxis(coeffHeadingCorrection,Vector3.up) * toApply;
		}
	
		void MatchLocalAlignment ()
		{
				int layerMask = 1 << 9; // Prey Layer
				Collider[] LocalFlock = Physics.OverlapSphere (this.transform.position, LocalFlockRadius, layerMask);
				Vector3 average = Vector3.zero;
				for (int i=0; i<LocalFlock.Length; i++) {
						PreyEvading other = (PreyEvading)LocalFlock [i].GetComponent ("PreyEvading");
			
						Vector3 otherDirection = other.toApply.normalized;
						if (other.transform.position != this.transform.position) {	
								average += otherDirection;
						}
				}
				if (LocalFlock.Length > 1) {

						AvgLocalHeading = average / (LocalFlock.Length - 1);
						toApply += AvgLocalHeading.normalized * alignmentCoefficient;
				}
		}

	void MatchAlignment ()
	{
		GameObject[] allPreys = GameObject.FindGameObjectsWithTag ("Preys");
		Vector3 average = Vector3.zero;
		for (int i=0; i<allPreys.Length; i++) {
			PreyEvading other = (PreyEvading)allPreys [i].GetComponent ("PreyEvading");
			
			Vector3 otherDirection = other.toApply.normalized;
			if (other.transform.position != this.transform.position) {	
				average += otherDirection;
			}
		}
		if (allPreys.Length > 1) {
			
			AvgLocalHeading = average / (allPreys.Length - 1);
			toApply += AvgLocalHeading.normalized * alignmentCoefficient;
		}
	}


		void changeAnimation()
	{
		/*
		if (charControl.velocity.magnitude < 1) {
			animation.Play("Default Take");
		} else
		*/
		if (charControl.velocity.magnitude < 8) {
			animation.Play("zebra_walk");		
		}
		else if (charControl.velocity.magnitude > 30) {
			animation.Play("zebra_run");		
		}

		else{
			animation.Play("zebra_run__sprint");
		}
	}

	void staminaUpdate()
	{
		// cap if out of strength
		if (toApply.magnitude > StaminaUseThreshold && stamina < 0) {
			toApply = toApply.normalized * StaminaUseThreshold;
		}
		else if (toApply.magnitude > StaminaUseThreshold && stamina>= 0.01f)
		{
		//use stamina if over threshold$
			stamina-=0.05f;
		}

		// stamina regen
		if (stamina <= 0f) {
			stamina=0f;
				}
		stamina+=0.00001f;


	}

	void SlowDownNotChasing()
	{
		if (!isEvading && toApply.magnitude > StaminaUseThreshold) {
			toApply-=toApply/8;
		}
	}

		Vector3 RandomHeading (Vector3 originalHeading, float freedom)
		{
				return new Vector3 (originalHeading.x + Random.Range (-freedom, freedom), 0, originalHeading.z + Random.Range (-freedom, freedom)); 
		}

		Vector3 RandomHeading (float freedom)
		{
				return new Vector3 (Random.Range (-freedom, freedom), 0, Random.Range (-freedom, freedom)); 
		}

	void OnTriggerEnter(Collider other) {
		if (other.gameObject.CompareTag("Predator"))
		{
		print ("STOP !");
		Time.timeScale = 0;
		}
	}
}
