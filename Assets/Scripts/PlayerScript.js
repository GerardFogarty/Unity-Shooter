#pragma strict

/*
* This script handles player functionality such as health, movement etc 
*/


// possible health values
private var GREEN:int = 5;
private var YELLOW:int = 3;
private var RED:int = 1;
private var DEAD:int = 0;
public static var healthLevel:int;	


function Start () {
	healthLevel = GREEN;
}

function Update () {

	// rotating the player to face where the mouse is pointing
	var mousePos = Input.mousePosition; 
    var wantedPos:Vector3 = Camera.main.ScreenToWorldPoint(mousePos); 	// gets position of cursor on screen
	wantedPos.y = transform.position.y;									// sets wanted y-value to FPC's y-value so it doesnt look 'under' itself (when mouse is on FPC it would look at the ground)
	transform.LookAt(wantedPos);
}


function decreaseHealth() {	
	healthLevel--;	
}

function increaseHealth() {	
	healthLevel++;	
}

function getPowerup(powerupType:String) {
	// check type
	// add weapon/ammo/etc (hasShotgun = true)
	
	switch (powerupType) {
	
		case "PowerupShotgun":
			PlayerShoot.hasShotgun = true;
			Debug.Log("Shotgun added");
		break;
		
		case "PowerupSpawnGun":
			PlayerShoot.hasSpawnGun = true;
			Debug.Log("spawngun added");
		break;
		
		case "PowerupLaserGun":
			PlayerShoot.hasLaserGun = true;
			Debug.Log("lasergun added");
		break;
		
		case "PowerupSpawnAmmo":
			PlayerShoot.spawnGunAmmo += 5;
			Debug.Log("spawn ammo added");
		break;
		
	}
	
}