#pragma strict


/*
*	Handles the various ways the player can fire projectiles
*/

private var STANDARD_GUN = 1;
private var SHOTGUN = 2;
private var LASER_GUN = 3;
private var SPAWN_GUN = 4;
var currentWeapon;

var standardBullet:GameObject;
var shotgunBullet:GameObject;
var spawnBullet:GameObject;

var shootTimer:float = 0.1; 					// time before gun can fire again
var standardGunTimerResetValue:float = 0.1;
var shotgunTimerResetValue:float = 1.0;

public static var hasShotgun:boolean = false;
public static var hasSpawnGun:boolean = false;
public static var hasLaserGun:boolean = false;
public static var spawnGunAmmo:int;	

public var heat:float = 0.0;					// heat generated by shooting
var MAX_HEAT:float = 100.0;						// gun overheats beyond this
public var cooldownTimer:float = 0.0;			


function Start () {
	currentWeapon = STANDARD_GUN;
	spawnGunAmmo = 3;
}

function Update () {

	if (shootTimer > 0.0) shootTimer -= Time.deltaTime;


	if (Input.GetKeyDown(KeyCode.Alpha1) || Input.GetKeyDown(KeyCode.Keypad1))		
		{	currentWeapon = STANDARD_GUN;	GameObject.Find("GUIManager").gameObject.SendMessage("setCurrentGun", STANDARD_GUN); 	}
	if ((Input.GetKeyDown(KeyCode.Alpha2) || Input.GetKeyDown(KeyCode.Keypad2))
			&& PlayerShoot.hasShotgun)		
		{	currentWeapon = SHOTGUN;	GameObject.Find("GUIManager").gameObject.SendMessage("setCurrentGun", SHOTGUN); 	}
	if ((Input.GetKeyDown(KeyCode.Alpha3) || Input.GetKeyDown(KeyCode.Keypad3))
			&& PlayerShoot.hasSpawnGun)		
		{	currentWeapon = SPAWN_GUN;	GameObject.Find("GUIManager").gameObject.SendMessage("setCurrentGun", SPAWN_GUN); 	}
	/*if ((Input.GetKeyDown(KeyCode.Alpha4) || Input.GetKeyDown(KeyCode.Keypad4))	
			&& PlayerShoot.hasLaserGun)		
		{	currentWeapon = LASER_GUN;	GameObject.Find("GUIManager").gameObject.SendMessage("setCurrentGun", LASER_GUN); 	}*/
	
	
	

	if(Input.GetButton("Fire1") && shootTimer <= 0.0 && cooldownTimer <= 0.0) {
	
		switch (currentWeapon) {
		
			case (STANDARD_GUN): 	fireStandardGun(); 	break;
			case (SHOTGUN): 		fireShotgun(); 		break;
			//case (LASER_GUN): 		fireLaserGun();		break;
			case (SPAWN_GUN): 		if (spawnGunAmmo > 0 && Input.GetButtonDown("Fire1")) fireSpawnGun(); break;
			default:					;
		}
	}
	
	
	
	if (heat >= MAX_HEAT) {
		// gun has overheated
		cooldownTimer = 3.0;
		heat = 99.999;
	}
	
	if (cooldownTimer <= 0.0 && heat >= 0.0) { 
		// gun is getting cold	
		heat -= Time.deltaTime * 20.0; 
	} else if (cooldownTimer >= 0.0) {
		// gun has overheated but not cooling yet
		cooldownTimer -= Time.deltaTime;
	}
	
}



function fireStandardGun() {

	var bullet = Instantiate(standardBullet, gameObject.transform.position, Quaternion());
	bullet.rigidbody.AddForce (GameObject.Find("Player").transform.forward * 50, ForceMode.Impulse);
	shootTimer = standardGunTimerResetValue;
	heat += 5;
	GameManager.numBulletsFired++;
}

function fireShotgun() {
	
	// fire 15 bullets in various directions like shotgun blast
	for (var i=0; i<15; i++) {
		var bullet = Instantiate(shotgunBullet, gameObject.transform.position, Quaternion() );
		
		var mousePos = Input.mousePosition; 
    	var wantedPos:Vector3 = Camera.main.ScreenToWorldPoint(mousePos); 	// gets position of cursor on screen
		wantedPos.y = transform.position.y;									// sets wanted y-value to bullets's y-value so shoots in straight line
		wantedPos.x += Random.Range(-1.0, 1.0);								// spread bullet by random value
		bullet.gameObject.transform.LookAt(wantedPos);
	
		bullet.rigidbody.AddForce (bullet.gameObject.transform.forward * Random.Range(45.0,55.0), ForceMode.Impulse);
	}
	shootTimer = shotgunTimerResetValue;
	heat += 15.0;
	GameManager.numBulletsFired++;
}

function fireLaserGun() {
	
	// will be done soon!
}

function fireSpawnGun() {

	var bullet = Instantiate(spawnBullet, gameObject.transform.position, Quaternion());
	bullet.rigidbody.AddForce (GameObject.Find("Player").transform.forward * 10, ForceMode.Impulse);
	spawnGunAmmo--;
	heat += 40.0;
	GameManager.numBulletsFired++;
}