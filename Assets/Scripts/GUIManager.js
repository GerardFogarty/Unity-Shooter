#pragma strict

/*
*	Handles GUI display for things like current weapons, weapon heat indicator, powerups spawning etc
*
*/	

/* textures for drawing current weapon onscreen*/
public var stdGunTexture:Texture2D;
public var shotGunTexture:Texture2D;
public var laserGunTexture:Texture2D;
public var spawnGunTexture:Texture2D;
private var currentGunTexture:Texture2D;

/* textures and position for heat indicator*/
public var texGreen:Texture2D;
public var texYellow:Texture2D;
public var texRed:Texture2D;
private var HeatIndicatorPos: Vector2 = new Vector2(10, Screen.height - 25);
private var HeatIndicatorSize: Vector2 = new Vector2(250,15);

private var LifeIndicatorPos: Vector2 = new Vector2(10, Screen.height - 50);
private var LifeIndicatorSize: Vector2 = new Vector2(250,15);

/* flags telling OnGUI what to draw*/
public static var drawHUD:boolean = false;
public static var displayPowerupWarningMessage:float = 0.0;

/*GUI Skins*/
var skinLarge:GUISkin;				// for inspector
public static var SkinLarge:GUISkin;
var skinSmall:GUISkin;				// for inspector
public static var SkinSmall:GUISkin;

function Start(){
	
	SkinLarge = skinLarge;
	SkinSmall = skinSmall;
	currentGunTexture = stdGunTexture;
}

function Update () {
	if (displayPowerupWarningMessage > 0.0) displayPowerupWarningMessage -= Time.deltaTime;
}

function setGUI(b:boolean) {

	drawHUD = b;
	
}

function setCurrentGun(gun) {
	
	switch (gun) {
		case 1:	currentGunTexture = stdGunTexture;
		break;
		
		case 2:	currentGunTexture = shotGunTexture;
		break;

		case 3:	currentGunTexture = laserGunTexture;
		break;
		
		case 4:	currentGunTexture = spawnGunTexture;
		break;
	}		
}

function OnGUI() {

    GUI.skin = SkinSmall;
    
    // draw HUD for player while game is playing
	if (drawHUD) {	
		GUI.skin = SkinSmall;
		
		// current weapon
		GUI.Box(Rect(10, 10, 200, 75), currentGunTexture);
			
		var heatLevel:float   =  GameObject.Find("Gun").GetComponent(PlayerShoot).heat;
		var cooldown:boolean  = (GameObject.Find("Gun").GetComponent(PlayerShoot).cooldownTimer >= 0.0) ? true: false;
		
		// Heat Indicator
    	GUI.BeginGroup (new Rect (HeatIndicatorPos.x, HeatIndicatorPos.y, HeatIndicatorSize.x, HeatIndicatorSize.y));  
    		
    		GUI.Box(Rect (0,0, HeatIndicatorSize.x, HeatIndicatorSize.y), "");
        	GUI.DrawTexture(Rect (5,2, (HeatIndicatorSize.x-10) * heatLevel/100.0, HeatIndicatorSize.y-4), cooldown ? texRed : texYellow, ScaleMode.StretchToFill, false);
    	GUI.EndGroup ();
    	
    	// Life Indicator
    	var health:int = PlayerScript.healthLevel;
    	GUI.BeginGroup (new Rect (LifeIndicatorPos.x, LifeIndicatorPos.y, LifeIndicatorSize.x, LifeIndicatorSize.y));  
    		
    		var healthTexture:Texture2D;
    		if (health <=5)	healthTexture = texGreen;
    		if (health <=3)	healthTexture = texYellow;
    		if (health <=1)	healthTexture = texRed;
    		
    		GUI.Box(Rect (0,0, LifeIndicatorSize.x, LifeIndicatorSize.y), "");
        	GUI.DrawTexture(Rect (5,2, (LifeIndicatorSize.x-10) * health/5, LifeIndicatorSize.y-4), healthTexture, ScaleMode.StretchToFill, false);
    	GUI.EndGroup ();
    	
    	// "Powerup spawned" message	
    	if (displayPowerupWarningMessage > 0.0) {
    		GUI.Box(Rect(Screen.width-220, 20, 200, 50), "Powerup crate spawned - don't shoot it!");
    	}			
    	
	}	//if drawHUD
	
	// draw end-game screen							2 = FINISHED
	else if (!drawHUD && GameManager.currentState == 2) {
		GUI.skin = SkinLarge;
		
		var menuSize:Vector2 = Vector2(400,500);
		var menuPosition:Vector2 = Vector2((Screen.width-menuSize.x)/2,(Screen.height-menuSize.y)/2);
		GUI.BeginGroup (new Rect (menuPosition.x, menuPosition.y, menuSize.x, menuSize.y));  
			GUI.Box (Rect (0,0,menuSize.x,menuSize.y), "End-game Brief");
			
			GUI.Label(Rect(10,50,menuSize.x-100,30), "Score:");
			GUI.Label(Rect(menuSize.x-80,50, 90,30), "" +GameManager.score);
				
			GUI.Label(Rect(10,100,menuSize.x-100,30), "Enemies Killed:");
			GUI.Label(Rect(menuSize.x-80,100, 90,30), "" +GameManager.numEnemiesKilled);
			
			GUI.Label(Rect(10,150,menuSize.x-100,30), "Shots Fired:");
			GUI.Label(Rect(menuSize.x-80,150, 90,30), "" +GameManager.numBulletsFired);
			
			GUI.Label(Rect(10,200,menuSize.x-100,30), "Powerups Gained:");
			GUI.Label(Rect(menuSize.x-80,200, 90,30), "" +GameManager.numPowerupsGained);
			
			GUI.Label(Rect(10,250,menuSize.x-100,30), "Powerups Destroyed:");
			GUI.Label(Rect(menuSize.x-80,250, 90,30), "" +GameManager.numPowerupsDestroyed);
			
			GUI.Label(Rect(10,300,menuSize.x-100,30), "Spawn Lanes Hit:");
			GUI.Label(Rect(menuSize.x-80,300, 90,30), "" +GameManager.numSpawnPointsHit);
			
		GUI.EndGroup ();	
	}	
	
} // onGUI