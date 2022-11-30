const shifts = [56n, 48n, 40n, 32n, 24n, 16n, 8n, 0n];

module.exports = {

	parseBuffer: _buffer => {

		//Since one 64 bit integer takes 8 bytes of space, we
		//need _array to be only 1/8 the size of the buffer.
		let _array = new Array(_buffer.length >> 3);

		//Read the 8 byte pieces of _buffer and turn them into
		//64 bit integers, which get put into _array as strings.
		for (let i = 0; i < _array.length; i++) {
			let _bigint = 0n;
			for (let j = 0; j < 8; j++) _bigint += BigInt(_buffer[i * 8 + j]) << shifts[j];
			_array[i] = _bigint.toString();
		}

		return _array;
	},

	unparse64IntStringArray: _array => {

		//One 64 bit integer takes 8 bytes, so we need
		//to make _buffer 8 times the size of _array.
		let _buffer = Buffer.alloc(_array.length << 3);

		//Convert the 64 bit integers (represented as strings)
		//of _array into 8 byte pieces and put them into _buffer.
		for (let i = 0; i < _array.length; i++) {
			let _bigint = BigInt(_array[i]);
			for (let j = 0; j < 8; j++) _buffer[i * 8 + j] = parseInt((_bigint >> shifts[j]) & 0xffn);
		}

		return _buffer;
	}
}

/*
FILE FORMAT OF .64ia (64-bit Integer Array) & HOW TO PARSE



An example file, a chain of 64 bit chunks:

<Buffer FF FF FF FF FF FF FF 00 EE EE EE EE EE EE EE 00 DD DD DD DD DD DD DD 00 CC CC CC CC CC CC CC 00 BB BB BB BB BB BB BB 00 AA AA AA AA AA AA AA 00>



When parsing, gets split into individual 8 byte chunks:

<Buffer FF FF FF FF FF FF FF 00>

<Buffer EE EE EE EE EE EE EE 00>

<Buffer DD DD DD DD DD DD DD 00>

<Buffer CC CC CC CC CC CC CC 00>

<Buffer BB BB BB BB BB BB BB 00>

<Buffer AA AA AA AA AA AA AA 00>

(Last byte is 00 for demonstration purposes.)
(It isn't required to be 00.)



Then those 8 byte chunks get turned into 64 bit integers and stringified:

<Buffer FF FF FF FF FF FF FF 00> => 18446744073709551360n => "18446744073709551360"



To unparse it, simply do the reverse!
*/