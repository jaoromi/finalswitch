/*!
 * Final Switch JavaScript library v0.0.1
 * (c) Lee Ju Hee - http://www.zzzmobile.co.kr/
 * License: ??
 */

(function(factory){
	
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
};

var on = true;
var off = false;

var finalswitch = factory();

finalswitch.switches = {}; // available switches
finalswitch.defaultSwitches = undefined; // default switch vales when reset
finalswitch.machines = {}; // available machines

var machineChain = {}; // map switch to machine's chaine
var anonymousId = 0; // id of anonymous machine


/**
 * Add available switch.
 * @param {string} name switch's name
 * @param [Object] default switch' default value when reset
 */
finalswitch.addSwitch = function(name, defaultFlag) {
	finalswitch.switches[name] = false;
	
	if(defaultFlag) {
		finalswitch.switches[name] = flag;
		finalswitch.defaultSwitches[name] = flag;
	}
};

/**
 * Add available machine.
 * @param {string} name machine's name
 * @param {Object} machine object. machine means object to act when final switch is on.
 * @param [Array] switches to connect. initialize machine to connect switches 
 */
finalswitch.registerMachine = function(name, machine) {
	if(name == null) name = '_' + anonymousId; 
	
	if(machine instanceof Function) {
		machine = new finalswitch.Machine(name, machine);
	}
	
	finalswitch.machines[name] = machine;
	
	for(var i = 2; i < arguments.length; i++) {
		var switchName = arguments[i];
		
		finalswitch.connectSwitch(name, switchName);
	}
};

/**
 * Connect machine object to switches. The machine object monitored by this switches and
 * triggered a final switch 'on'. 
 * @param {string} name machine's name
 * @param {Object} machine object. machine means object to act when final switch is on.
 * @param [Array] switches to connect. initialize machine to connect switches 
 */
finalswitch.connectSwitch = function (machine, _switch) {
	if(machine == null || _switch == null) throw 'machine or switches is null.';
	
	if(finalswitch.machines[machine] === undefined) throw "machine's name[" + machine + "] is not exists.";
	
	if(Array.isArray(_switch) == false) {
		if(finalswitch.switches[_switch] === undefined)
			finalswitch.addSwitch(_switch);
		
		if(machineChain[_switch] === undefined) machineChain[_switch] = [];
		
		machineChain[_switch].push(finalswitch.machines[machine]);
		//finalswitch.machines[machine].switches[_switch] = finalswitch.defaultSwitches || false;
		finalswitch.machines[machine].connect(_switch);
		
		return;
	}
	
	for(var i = 0; i < _switch.length; i++) {
		finalswitch.connectSwitch(machine, _switch[i]);
	}
};

/**
 * switch on. if this switch connected machine is final switch, machine is triggered.
 * @param {string || Array} name switch
 */
finalswitch.switchOn = function(_switch) {
	if(Array.isArray(_switch) == false) {
		finalswitch.switches[_switch] = on;
		
		if(machineChain[_switch] !== undefined) {
			for(var i = 0; i < machineChain[_switch].length; i++) {
				machineChain[_switch][i].on(_switch);
			}
		}
		
		return;
	}
	
	for(var i = 0; i < _switch.length; i++) {
		finalswitch.switchOn(switches[idx]);
	}
};

/**
 * switch of name off.   
 * @param {string || Array} name switch
 */
finalswitch.switchOff = function(_switch) {
	if(Array.isArray(_switch)) {
		finalswitch.switches[_switch] = off;
		
		if(machineChain[_switch] !== undefined) {
			for(var i = 0; i < machineChain[_switch].length; i++) {
				machineChain[_switch][i].off(_switch);
			}
		}
		
		return;
	}
	
	for(var i = 0; i < _switch.length; i++) {
		finalswitch.switchOff(_switch[i]);
	}
};

/**
 * reset all switches and machines   
 */
finalswitch.reset = function() {
	for(name in finalswitch.switches) {
		finalswitch.switches[name] = off; 
	}
	
	if(finalswitch.defaultSwitches) {
		for(name in finalswitch.switches) {
			if(finalswitch.defaultSwitches.hasOwnProperty(name))
				finalswitch.switches[name] = finalswitch.defaultSwitches[name];
		}
	}
	
	for(var name in machines) {
		machines[name].reset();
	}
};

/**
 * reset machines   
 */
finalswitch.reset = function(name) {
	machines[name].reset();
};

/**
 * switch machine.
 */
finalswitch.Machine = function(name, action) {
	var self = this;
	self.name = name;
	self.switches = {};
	self.action = action;
	
	var triggered = false;
	
	for(var i = 2; i < arguments.length; i++) {
		self.connect(arguments[i]);
	}
	
	self.connect = function(_switch) {
		if(typeof _switch == 'object') {
			for (var name in _switch) {
				var flag = _switch[name];
				self.switches[name] = flag;
				
				if(!finalswitch.switches.hasOwnProperty(name)) {
					finalswitch.addSwitch(name, flag);
				}
			}
		} else {
			var name = _switch;
			self.switches[name] = false;
			
			if(!finalswitch.switches.hasOwnProperty(name)) {
					finalswitch.addSwitch(name);
			} else {
				self.switches[name] = finalswitch.switches[name];
			}
		}
		
		if(self.isFinalSwitchOn()) {
			triggered = true;
			
			action();
		}
	};
	
	self.on = function(name) {
		if(self.switches[name] == undefined) throw "switch: '" + name + "' is not exists.";
		if(triggered) throw 'Machine: ' + self.name + ' already triggered. If you want to re-trigger, please reset machine object';
		
		self.switches[name] = on;
		
		if(self.isFinalSwitchOn(name)) {
			triggered = true;
			
			if(arguments.length > 1) {
				self.action.apply(null, arguments.slice(1, arguments.length));
			} else {
				action();
			}
		}
	};
	
	self.off = function(name) {
		self.switchs[name] = off;
		offSwitchs.add(name);
	};
	
	self.reset = function() {
		for(name in self.switches) {
			self.switches[name] = off; 
		}
		
		if(finalswitch.defaultSwitches) {
			for(name in self.switches) {
				if(finalswitch.defaultSwitches.hasOwnProperty(name))
					self.switches[name] = finalswitch.defaultSwitches[name];
			}
		}
		triggered = false;
	};
	
	self.isFinalSwitchOn = function() {
		var finalFlag = on; 
		for(name in self.switches) {
			finalFlag = finalFlag & self.switches[name];  
		}
		
		return finalFlag;
	};

};
})(function() {
	// factory initialize
	window['finalswitch'] = {};
	
	return window['finalswitch'];
});
