#pragma strict

/*
*	This script handles the intro animation - moves the intro camera from its start position to the position of the Main Camera
*	Lots of tweaking and seemingly random values were needed here to get positioning just right. Still not perfect
*/

var startPos:Vector3;
var startRot:Quaternion;
var endPos:Vector3;
var endRot:Quaternion;

function Start () {

	endPos = GameObject.Find("Main Camera").gameObject.transform.position;
	endPos.y += 14;
	endPos.z -= 0.1;
	endRot = GameObject.Find("Main Camera").gameObject.transform.rotation;
}

function Update () {
}

function moveCamera() {

	startPos = gameObject.transform.position;
	startRot = gameObject.transform.rotation;
	
	gameObject.transform.position = Vector3.Lerp(startPos, endPos, Time.deltaTime*1.2);
    gameObject.transform.rotation = Quaternion.Lerp(startRot, endRot, Time.deltaTime*1.2);
    
	// reached end position
	if (gameObject.transform.position.y > endPos.y-0.2 && gameObject.transform.position.y < endPos.y+0.5) {
		gameObject.camera.enabled = false;
		GameObject.Find("Main Camera").gameObject.camera.enabled = true;
		GameManager.currentState++;		// change from INTRO to PLAYING state
		GameObject.Find("GUIManager").gameObject.SendMessage("setGUI", true);
		Destroy(gameObject);
	}
}
