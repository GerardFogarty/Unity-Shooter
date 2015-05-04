#pragma strict


/*
*	This script controls the enemy spawn points, handling details such as the time between spawns and the type of enemy. 
* 	Each spawn point has its own script and may have unique behaviour compared to other spawn points
*/

var Enemy1Prefab:GameObject;
var PowerupCratePrefab:GameObject;

public var spawnTimer:float;				// time til next enemy
public var spawnTimerResetValue:float;		// value spawnTimer is reset to after an enemy is spawned. this is changed by GameManager to affect gameplay
public var minSpawnTimerResetValue:float;	// minimum time between spawns (can change per spawn point)
public var spawnDisabled:boolean;			// spawn point can be temporarily disabled
var timeTilSpawnEnabled:float;				// time until spawnDisabled is reset to false
var enemyType:String;						// type of enemy to be spawned. also changed by GameManager



function Start () {
	spawnTimer = Random.Range(2.5, 4.5);
	spawnTimerResetValue = Random.Range(5.0, 8.0);
	minSpawnTimerResetValue = Random.Range(1.0, 3.0);
	spawnDisabled = false;
	timeTilSpawnEnabled = 10.0;
	enemyType = "Enemy1";
	
}

function Update () {

	// 1 = PLAYING
	if (GameManager.currentState == 1) {
		
		// if spawn not disabled, decrease spawn timer. if spawn is disabled, decrease time til it is re-enabled
		if (!spawnDisabled)		spawnTimer -= Time.deltaTime;
		else if (spawnDisabled) {
			timeTilSpawnEnabled -= Time.deltaTime;
			if (timeTilSpawnEnabled <= 0.0) {
				spawnDisabled = false;
				timeTilSpawnEnabled = 10.0;
			}
		}
		
		if (spawnTimer <= 0.0) {
			spawnEnemy();
			spawnTimer = spawnTimerResetValue;
		}
	}
}

function spawnEnemy() {
	
	switch (enemyType) {
		case "Enemy1":
			Instantiate(Enemy1Prefab, transform.position, transform.rotation);	// rotation doesnt matter here, Enemy1 sets its own rotation
			break;
			
		// more enemies to come
			
		default:
			;
		
	}	
}

function spawnPowerup(powerupType:String) {

	var crate = Instantiate(PowerupCratePrefab, transform.position, PowerupCratePrefab.transform.rotation);
	crate.GetComponent(PowerupScript).type = powerupType;
	
	switch (powerupType) {
		case "PowerupShotgun":
			crate.GetComponent(PowerupScript).message = "Shotgun gained!";
			break;
			
		case "PowerupSpawnGun":
			crate.GetComponent(PowerupScript).message = "Spawngun gained! \nShoot at a lane to slow spawn times!";
			break;
			
		case "PowerupSpawnAmmo":
			crate.GetComponent(PowerupScript).message = "Spawngun ammo +5";
			break;		
	}
}

function setEnemyType(type:String) {
	enemyType = type;
}

function decreaseSpawnTimeLengthBy(decreaseValue:float) {
	spawnTimerResetValue -= decreaseValue;
	if (spawnTimerResetValue < minSpawnTimerResetValue)	spawnTimerResetValue = minSpawnTimerResetValue;
}

function increaseSpawnTimeLengthBy(increaseValue:float) {
	spawnTimerResetValue += increaseValue;
}

function setSpawnDisabled(b:boolean, forTime:float) {
	spawnDisabled = b;
	timeTilSpawnEnabled = forTime;
	if (timeTilSpawnEnabled <0.0)	timeTilSpawnEnabled = 0.0; 		// just in case
}