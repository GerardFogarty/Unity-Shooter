#pragma strict

public var type:String;
public var message:String;			// message displayed when this powerup is picked up
private var displayGui:boolean;

function Start() {
	displayGui = false;
}

function Update () {

	transform.LookAt(GameObject.Find("Player").transform);
	rigidbody.velocity = transform.forward*5;
}


function OnCollisionEnter( c:Collision) {
	
	if (c.collider.gameObject.name == "Player") {
		c.collider.gameObject.SendMessage("getPowerup", type);
		GetComponent(MeshRenderer).enabled = false;
		displayGui = true;
		Destroy(gameObject, 2.0);
		GameManager.numPowerupsGained++;
	}
	
}


function OnGUI() {
	
	GUI.skin = GUIManager.SkinSmall;
	// show message saying powerup gained
	if (displayGui) {
		GUI.Box(new Rect(Screen.width/2+40, Screen.height/2-40, 140, 50), message);	
	}
	
}
