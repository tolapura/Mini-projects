function Resource (name) {
	this.name = name;
	this.users = [];
	this.currWaiting = 0;
}

function User(name, number,waitingTime, usageTime) {
	this.name = name;
	this.number = number;
	this.waitingTime = waitingTime;
	this.usageTime = usageTime;
	this.display = function () {
		console.log(this.name + ' (' + this.waitingTime + ' ,' + this.usageTime + ')');
	}
}

var app = new Vue({
  el: '#app',
  data: {
  	startBtn: 1,
    message: 'Hello Vue!',
    users: 1,
    resources: 1,
    arrayOfUsers: [],
    arrayOfResources: [],
    time: 0,
    started: 0,
  },
  methods: {
  	getWaitingTime: function(n) {
  		var arr = this.arrayOfResources[n-1].users;
  		return arr[0].number + ' (' + arr[0].waitingTime + ')';
  	},
  	removeFirstElement: function(n) {
  		var arr = this.arrayOfResources[n-1].users;
  		if (arr.length != 0 && arr[0].waitingTime == 0) {
  			return arr.slice(1,arr.length);
  		}
  		return arr;
  	},
  	arrayIsMoreThanOne: function(n) {
  		return this.arrayOfResources[n-1].users.length > 1;
  	},
  	resourceTimeLeft: function(n) {
  		return this.arrayOfResources[n-1].currWaiting;
  	},
  	isNotWaiting: function(n) {
  		return this.arrayOfResources[n-1].users[0].waitingTime == 0;
  	},
  	currentUser: function(n) {
  		return this.arrayOfResources[n-1].users[0].number;
  	},
  	currentUserDetails: function (n) {
  		var user = this.arrayOfResources[n-1].users[0];
  		return user.number + ' (' + user.usageTime + ')';
  	},
  	arrayIsEmpty: function(n) {
  		return this.arrayOfResources[n-1].users.length;
  	},
  	randNum: function(min, max) {
  		return Math.floor((Math.random() * max) + min);
  	},
  	shuffle: function(array) {
  		for (var c = array.length - 1; c > 0; c--) {
		    var b = Math.floor(Math.random() * (c + 1));
		    var a = array[c];
		    array[c] = array[b];
		    array[b] = a;
  		}
  		return array;
	},
  	reset: function() {
  		this.time = 0;
  		this.started = 0;
  		this.arrayOfUsers = [];
  		this.startBtn = 1;
  		this.users = 1;
  		this.resources = 1;
  		this.arrayOfResources = [];
  	},
  	submit: function() {
  		this.startBtn = 0;
  		this.addUsers(0);
  	},
  	displayUsers: function(array) {
  		for (var i = 0; i < array.length; i++) {
  			array[i].display();
  		}
  	},
  	displayResources: function() {
  		for (var i= 0; i < this.arrayOfResources.length; i++){
  			this.displayUsers(this.arrayOfResources[i].users);
  		}
  	},
  	random: function() {
  		this.startBtn = 0;
  		this.addUsers(1);
  	},
    sortNum: function(a, b) {
      return a - b;
    },
  	populate: function() {
  		var listOfResources = [];
  			for (var i = 1; i <= this.resources; i++) {
  				listOfResources.push(i);
  				var resource = new Resource("Resource " + i);
  				this.arrayOfResources.push(resource);
  			}

  			for (var i = 1; i <= this.users; i++) {
  				var numOfResource = this.randNum(1, this.resources);
  				var userArrayOfRes = this.shuffle(listOfResources).slice(0, numOfResource).sort(this.sortNum);

  				var name = "User " + i;
  				console.log(name);
  				console.log(userArrayOfRes);
  				var oldWaitingTime = 0;
  				var oldUsageTIme = 0;
  				for (var j = 0; j < numOfResource; j++) {
  					var resToUse = userArrayOfRes[j]-1;
  					var waitingTime = 0;
  					var usageTime = this.randNum(1, 3);
  					var waitingTime = oldWaitingTime + oldUsageTIme;
  					if (this.arrayOfResources[resToUse].currWaiting > waitingTime) {
  						waitingTime = this.arrayOfResources[resToUse].currWaiting;
  					}
  					var newUser = new User(name, i, waitingTime, usageTime);
  					this.arrayOfResources[resToUse].users.push(newUser);
  					this.arrayOfResources[resToUse].currWaiting = waitingTime + usageTime;
  					oldWaitingTime = waitingTime;
  					oldUsageTIme = usageTime;
  				}
  			}
  			this.displayResources();
  			for(var i = 0; i < this.arrayOfResources.length; i++) {
	  			if(this.arrayOfResources[i].currWaiting > this.time){
	  				this.time = this.arrayOfResources[i].currWaiting;
	  			}
	  		}
  	},
  	addUsers: function(num) {
  		this.started = 1;
  		if (num == 0) {
  			this.populate();
  		} else {
  			this.users = this.randNum(1,30);
  			this.resources = this.randNum(1,30);
  			this.populate();
  		}
  	},
  	update: function() {
  		for(var i = 0; i < this.resources; i++){
  			if(this.arrayOfResources[i].users.length) {
  				for(var j = 0; j < this.arrayOfResources[i].users.length; j++) {
  					if(this.arrayOfResources[i].users[j].waitingTime == 0) {
  						this.arrayOfResources[i].users[j].usageTime--;
  					} else {
  						this.arrayOfResources[i].users[j].waitingTime--;
  					}
  					var resource = this.arrayOfResources[i].users[j];
  					if( resource.waitingTime == 0 && resource.usageTime == 0) {
  						this.arrayOfResources[i].users.shift();
  						j--;
  					}
  				}
  			}
  			if (this.arrayOfResources[i].currWaiting) {
				this.arrayOfResources[i].currWaiting--;
  			}
  		}
  		this.displayResources();
  	},
  }
})

window.setInterval(function(){
	if (app.started && app.time) {
	  	app.update();
	  	app.time--;
	}
}, 1000);