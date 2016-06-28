var util = require('util');

var bleno = require('../..');

var BlenoCharacteristic = bleno.Characteristic;

var EchoCharacteristic = function() {
  EchoCharacteristic.super_.call(this, {
    uuid: 'ec0e',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('EchoCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('EchoCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
  console.log('Hello we made it Degbug');
  console.log(this._updateValueCallback);
  console.log(maxValueSize);
  //data = 'hello';
  //updateValueCallback(data); 

  var data = new Buffer('dynamic value');
  updateValueCallback(data); 

  this.counter = 0;
  this.changeInterval = setInterval(function() {
	     var data = new Buffer(4);
	        data.writeUInt32LE(this.counter, 0);
		data = 'hello';

	    console.log('NotifyOnlyCharacteristic update value: ' + this.counter);
        updateValueCallback(data);
    this.counter++;
  }.bind(this), 5000);    
	  
};

EchoCharacteristic.prototype.onUnsubscribe = function() {
  console.log('EchoCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = EchoCharacteristic;
