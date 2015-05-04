#pragma strict

/*
*	COntrols behaviour of the spawn bullet projectile
*/

function Update () {

	var closestSpawnPoint = findClosestSpawn();
	transform.LookAt(closestSpawnPoint.transform);
	rigidbody.velocity = transform.forward*6;	
}

function OnCollisionEnter( c:Collision) {
	
	if (c.collider.gameObject.tag == "Enemy1") {
		Destroy(c.collider.gameObject);
		GameManager.score += 50;
		GameManager.numEnemiesKilled++;
	}
	
	if (c.collider.gameObject.name == "EnemySpawnPoint") {
		c.collider.gameObject.GetComponent(SpawnPointManager).setSpawnDisabled(true, 10.0);
		c.collider.gameObject.SendMessage("increaseSpawnTimeLengthBy", 3.0);
		GameManager.numSpawnPointsHit++;
		Destroy(gameObject);		
	}
	
}

function findClosestSpawn():GameObject { 
    var closest : GameObject; 
    var distance = Mathf.Infinity; 
    var position = transform.position; 
    
    /* Iterate through them and find the closest one */
    for (var i=1; i<=8; i++) { 
    	var enemy = GameObject.FindGameObjectWithTag("EnemySpawn" +i);
        var diff = (enemy.transform.position - position);
        var curDistance = diff.sqrMagnitude; 
        if (curDistance < distance) { 
            closest = enemy; 
            distance = curDistance; 
        } 
    }
    
    return closest;
}