#pragma strict


/*
*	The Game Manager controls the state of the game. It deals with transitioning between states and governs the way SpawnPointManager spawns enemies
*/

public var player:GameObject;
private var NUM_ENEMY_SPAWNS = 8;

// states
private var INTRO = 0;
private var PLAYING = 1;
private var FINISHED = 2;
public static var currentState:int;

public static var score:int;				// value to track player's progress & change game accordingly
private var scoreAtLastPowerupSpawn:int;	// this is used when spawning powerups to keep track of the last score a powerup was spawned at
private var scoreLevel:int;					// increases when player passes certain score thresholds
private var powerupsSpawned:int;	
	
public static var numEnemiesKilled:int; 
public static var numPowerupsDestroyed:int;
public static var numPowerupsGained:int;
public static var numBulletsFired:int;
public static var numSpawnPointsHit:int;


function Start () {

	currentState = INTRO;
	scoreLevel = 1;
	powerupsSpawned = 0;
	numEnemiesKilled = 0;
	numBulletsFired = 0;
	numPowerupsDestroyed = 0;
	numPowerupsGained = 0;
	numSpawnPointsHit = 0;
}

function Update () {

	switch (currentState) {
	
		// Camera intro animation
		case (INTRO):
			GameObject.Find("Intro Camera").SendMessage("moveCamera");	// move camera intro animation
			
			break;
			
		// Game is playing, player can move, enemies spawn etc etc
		case (PLAYING):
			processGame();
			break;
			
		// show Game Over screen with scores and stuff
		case (FINISHED):
			GameObject.Find("GUIManager").SendMessage("setGUI", false);
			killAllEnemies();	// destroy all enemies to stop them from interacting with player while brief is shown
			break;
			
		default:
			Debug.Log("GameManager: No current state");
			
		}
}

function processGame() {
	
	if (player.GetComponent(PlayerScript).healthLevel <= 0) {
		//Debug.Log("Game Over");
		currentState = FINISHED;
	}
	Debug.Log("Score " + score);
	
	
	/*
	*	Spawning powerups
	*/
	var longestSpawn:GameObject; 		// spawn point with longest time til next spawn
	
	// fixed powerups - these spawn at specific score levels
	if (score>=1000 && powerupsSpawned == 0) {	
		longestSpawn = getLongestSpawn();	
		longestSpawn.GetComponent(SpawnPointManager).spawnPowerup("PowerupShotgun");
		GUIManager.displayPowerupWarningMessage = 2.0;
		powerupsSpawned++;
	}
	else if (score>=2000 && powerupsSpawned == 1) {
		longestSpawn = getLongestSpawn();	
		longestSpawn.GetComponent(SpawnPointManager).spawnPowerup("PowerupSpawnGun");
		powerupsSpawned++;
	}
	
	// non-fixed spawns - these spawn every 500 points after score has exceeded 2000 
	if (score>2000 && score%1500>=0 && score%1500<5 && score>scoreAtLastPowerupSpawn) {
		longestSpawn = getLongestSpawn();	
		if (!PlayerShoot.hasShotgun) 		longestSpawn.GetComponent(SpawnPointManager).spawnPowerup("PowerupShotgun");
		else if (!PlayerShoot.hasSpawnGun)	longestSpawn.GetComponent(SpawnPointManager).spawnPowerup("PowerupSpawnGun");
		else 								longestSpawn.GetComponent(SpawnPointManager).spawnPowerup("PowerupSpawnAmmo");
		scoreAtLastPowerupSpawn = score;
	}
	
	
	/*
	*	Increase spawn times
	*/
	// decrease every spawn point's timer
	if (score >= 500 && scoreLevel == 1) {
		for (var i=1; i<=NUM_ENEMY_SPAWNS; i++) {
			GameObject.FindGameObjectWithTag("EnemySpawn"+i).SendMessage("decreaseSpawnTimeLengthBy", 0.2);//.GetComponent(SpawnPointManager).decreaseSpawnTime(0.5);
		}
		
		scoreLevel++;
	}
	// decrease every second spawn point's timer
	else if (score >= 1500 && scoreLevel == 2) {
		for (i=1; i<=NUM_ENEMY_SPAWNS; i+=2) {
			GameObject.FindGameObjectWithTag("EnemySpawn"+i).SendMessage("decreaseSpawnTimeLengthBy", 0.5);	
		}
		
		scoreLevel++;
	}
	else if (score >= 3000 && scoreLevel == 3) {
		for (i=1; i<=NUM_ENEMY_SPAWNS; i+=3) {
			GameObject.FindGameObjectWithTag("EnemySpawn"+i).SendMessage("decreaseSpawnTimeLengthBy", 1.0);	
		}
		
		scoreLevel++;
	}
}

// returns spawn point with longest time til next spawn
function getLongestSpawn():GameObject {

	var longestSpawn = GameObject.FindGameObjectWithTag("EnemySpawn1");		// will be spawnpoint with longest time til next enemy spawn
		for (var i=2; i<=8; i++) {
			var spawn = GameObject.FindGameObjectWithTag("EnemySpawn" + i);
			if (spawn.GetComponent(SpawnPointManager).spawnTimer > longestSpawn.GetComponent(SpawnPointManager).spawnTimer)
				longestSpawn = spawn;
		}
	return longestSpawn;
}

function killAllEnemies() {
	
	var objectsToDie = GameObject.FindGameObjectsWithTag("Enemy1");
	for (var obj in objectsToDie){ 
		Destroy(obj);
	}
}