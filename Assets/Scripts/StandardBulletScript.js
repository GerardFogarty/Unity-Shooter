#pragma strict

/*
*	Controls behaviour of the standard bullet projectile
*/

private var displayGui = false;

function OnCollisionEnter( c:Collision) {
	
	// destroy both, add score
	if (c.collider.gameObject.tag == "Enemy1") {
		Destroy(c.collider.gameObject);
		Destroy(gameObject);
		GameManager.score += 50;
		GameManager.numEnemiesKilled++;
	}
	
	// destroy crate, disable this render/collider, display message, destroy self in 2 seconds
	if (c.collider.gameObject.tag == "PowerupCrate") {
		Destroy(c.collider.gameObject);
		GetComponent(MeshRenderer).enabled = false;
		GetComponent(SphereCollider).enabled = false;
		displayGui = true;
		Destroy(gameObject, 1.0);
		GameManager.numPowerupsDestroyed++;
	}
	
}

function OnGUI() {
	GUI.skin = GUIManager.SkinSmall;
	// show message saying powerup gained
	if (displayGui) {
		GUI.contentColor = Color.white;
		GUI.backgroundColor = Color.red;
		GUI.Box(new Rect(Screen.width-150, 20, 150, 60),  "Don't shoot \npowerups!");
	}
	
}