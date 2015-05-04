#pragma strict

/*
* 	Controls Enemy1
*/

function Start () {

	
}

function Update () {

	// look at player and move forward
	transform.LookAt(GameObject.Find("Player").transform);
	rigidbody.velocity = transform.forward*2;
}


function OnCollisionEnter( c:Collision) {
	
	if (c.collider.gameObject.name == "Player") {
		Destroy(gameObject);
		c.collider.gameObject.SendMessage("decreaseHealth");
	}
	
}